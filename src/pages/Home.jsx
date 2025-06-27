// Imports
import Navbar from "../components/Navbar";
import Image from "../components/Image";
import "../style/image.css";
import bank from "../image/bank.svg";
import banky from "../image/banky.svg";
import safe from "../image/safe.svg";
import coin from "../image/coin.svg";
import shield from "../image/shield.svg";
import chevron from "../image/chevron.svg";
import eye from "../image/eye-slash.svg";
import plus from "../image/plus.svg";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const toggleDepositForm = () => setShowDepositForm(!showDepositForm);
  const toggleTransferForm = () => setShowTransferForm(!showTransferForm);
  const toggleBalance = () => setIsVisible(!isVisible);
  const toggleTransactions = () => setShowTransactions(!showTransactions);

  const handleInputChange = (e) => setDepositAmount(e.target.value);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(depositAmount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Enter a valid deposit amount.");
      return;
    }
    if (parsedAmount < 1000) {
      alert("Deposit must be at least ₦1,000.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !accountId) {
      alert("User or account not found.");
      return;
    }

    try {
      const newBalance = balance + parsedAmount;
      const res = await fetch(
        `https://685eda187b57aebd2afac8e8.mockapi.io/accounts/${accountId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, balance: newBalance }),
        }
      );
      const updated = await res.json();
      setBalance(updated.balance);
      setDepositAmount("");
      setShowDepositForm(false);
      alert("Deposit successful."), console.log("Deposit successful:", updated);

      await fetch("https://685ee8e37b57aebd2afaf305.mockapi.io/Transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          type: "deposit",
          amount: parsedAmount,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      alert("Error during deposit.");
      console.error(err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const userRes = await fetch(
        "https://685eda187b57aebd2afac8e8.mockapi.io/users"
      );
      const users = await userRes.json();
      const recipientUser = users.find((u) => u.email === recipientEmail);
      if (!recipientUser) return alert("Recipient not found");

      const accountRes = await fetch(
        "https://685eda187b57aebd2afac8e8.mockapi.io/accounts"
      );
      const accounts = await accountRes.json();
      const recipientAccount = accounts.find(
        (acc) => acc.userId === recipientUser.id
      );
      if (!recipientAccount) return alert("Recipient has no account");

      const senderNewBalance = balance - amount;
      const recipientNewBalance = recipientAccount.balance + amount;

      await fetch(
        `https://685eda187b57aebd2afac8e8.mockapi.io/accounts/${accountId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, balance: senderNewBalance }),
        }
      );

      await fetch(
        `https://685eda187b57aebd2afac8e8.mockapi.io/accounts/${recipientAccount.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: recipientUser.id,
            balance: recipientNewBalance,
          }),
        }
      );

      await fetch("https://685ee8e37b57aebd2afaf305.mockapi.io/Transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          type: "transfer",
          amount,
          recipient: recipientEmail,
          timestamp: new Date().toISOString(),
        }),
      });

      setBalance(senderNewBalance);
      setTransferAmount("");
      setRecipientEmail("");
      setShowTransferForm(false);
      alert("Transfer successful.");
    } catch (err) {
      console.error("Transfer failed:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return navigate("/signin");

    const user = JSON.parse(userRaw);

    const fetchBalance = async () => {
      try {
        const res = await fetch(
          "https://685eda187b57aebd2afac8e8.mockapi.io/accounts"
        );
        const accounts = await res.json();
        const userAccount = accounts.find((acc) => acc.userId === user.id);
        if (userAccount) {
          setBalance(userAccount.balance);
          setAccountId(userAccount.id);
        } else {
          const createRes = await fetch(
            "https://685eda187b57aebd2afac8e8.mockapi.io/accounts",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id, balance: 2000 }),
            }
          );
          const newAccount = await createRes.json();
          setBalance(newAccount.balance);
          setAccountId(newAccount.id);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    fetchBalance();
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `https://685ee8e37b57aebd2afaf305.mockapi.io/Transactions?userId=${user.id}`
        );
        const data = await res.json();
        setTransactions(data.reverse());
      } catch (err) {
        console.error("Transaction fetch error:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="container">
        <div className="home-content">
          <div className="wrapper">
            <h4>
              <Image src={shield} alt="security" />
              Available Balance
              <span onClick={toggleBalance} style={{ cursor: "pointer" }}>
                <Image src={eye} />
              </span>
            </h4>

            <h4 onClick={toggleTransactions} style={{ cursor: "pointer" }}>
              Transaction History
              <Image src={chevron} />
            </h4>
          </div>

          <div className="flex-container">
            <div className="money">
              {isVisible ? `₦${balance}` : "₦****"}
              <Image src={chevron} />
            </div>

            <div>
              <button onClick={toggleDepositForm} className="add-money">
                <Image className="plus" src={plus} />
                Add Money
              </button>

              {showDepositForm && (
                <form onSubmit={handleDeposit}>
                  <input
                    placeholder="Enter amount"
                    type="number"
                    value={depositAmount}
                    onChange={handleInputChange}
                  />
                  <button type="submit" disabled={!accountId}>
                    Deposit
                  </button>
                </form>
              )}

              <button onClick={toggleTransferForm} className="add-money">
                <Image className="plus" src={plus} />
                Transfer Money
              </button>

              {showTransferForm && (
                <form onSubmit={handleTransfer}>
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                  <button type="submit">Send</button>
                </form>
              )}
            </div>
          </div>

          {showTransactions && (
            <div className="transaction-history">
              {transactions.length === 0 ? (
                <p>No transactions yet.</p>
              ) : (
                <ul>
                  {transactions.map((txn) => (
                    <li key={txn.id}>
                      <strong>{txn.type}</strong> — ₦{txn.amount}
                      {txn.recipient && <> → {txn.recipient}</>}
                      <br />
                      <small>{new Date(txn.timestamp).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="second-content">
          <div>
            <Image src={bank} alt="bank-logo" />
            <h3>To Vbank</h3>
          </div>
          <div>
            <Image src={banky} alt="bank-logo" />
            <h3>To others</h3>
          </div>
          <div>
            <Image src={safe} alt="bank-logo" />
            <h3>Safe</h3>
          </div>
          <div>
            <Image src={coin} alt="bank-logo" />
            <h3>Coins</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
