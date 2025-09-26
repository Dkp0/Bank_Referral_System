import pool from "../config/db.js";

// Add a new account
export const addAccount = async (req, res) => {
  const client = await pool.connect();
  try {
    const { account_id, introducer_id } = req.body;

    if (!account_id || introducer_id === undefined) {
      return res.status(400).json({ error: "Account ID and Introducer ID are required" });
    }

    await client.query("BEGIN");

    // Step 1: Count how many accounts this introducer has already brought
    const countRes = await client.query(
      "SELECT COUNT(*) FROM accounts WHERE introducer_id = $1",
      [introducer_id]
    );
    const introCount = parseInt(countRes.rows[0].count, 10);

    let beneficiary_id;

    if ((introCount + 1) % 2 !== 0) {
      // Odd introduction → Beneficiary is the Introducer
      beneficiary_id = introducer_id;
    } else {
      // Even introduction → Beneficiary is Introducer’s Introducer’s Beneficiary
      const introducerRes = await client.query(
        "SELECT introducer_id FROM accounts WHERE account_id = $1",
        [introducer_id]
      );

      if (introducerRes.rows.length === 0 || !introducerRes.rows[0].introducer_id) {
        // Introducer has no parent, fallback to introducer themselves
        beneficiary_id = introducer_id;
      } else {
        const introducersIntroducerId = introducerRes.rows[0].introducer_id;

        const parentRes = await client.query(
          "SELECT beneficiary_id FROM accounts WHERE account_id = $1",
          [introducersIntroducerId]
        );

        if (parentRes.rows.length === 0) {
          // No grandparent found → fallback
          beneficiary_id = introducer_id;
        } else {
          beneficiary_id = parentRes.rows[0].beneficiary_id;
        }
      }
    }

    // Step 2: Insert the new account
    const insertRes = await client.query(
      "INSERT INTO accounts (account_id, introducer_id, beneficiary_id, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [account_id, introducer_id, beneficiary_id, 0]
    );

    // Step 3: Credit ₹100 to beneficiary
    if (beneficiary_id) {
      await client.query(
        "UPDATE accounts SET balance = balance + 100 WHERE account_id = $1",
        [beneficiary_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Account added successfully & ₹100 credited to beneficiary",
      data: insertRes.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in addAccount:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// Get all accounts
export async function getAccounts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM accounts ORDER BY account_id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
