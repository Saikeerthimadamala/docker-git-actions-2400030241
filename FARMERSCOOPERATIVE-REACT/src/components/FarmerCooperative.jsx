import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const API = "http://localhost:2025/farmerscooperative";

export default function FarmerCooperative() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    cooperativeName: "",
    village: "",
    memberCount: "",
    registered: "true",
  });

  const [editingId, setEditingId] = useState(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupRecord, setLookupRecord] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadRecords = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API}/displayall`);
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const resetForm = () => {
    setForm({
      cooperativeName: "",
      village: "",
      memberCount: "",
      registered: "true",
    });

    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.cooperativeName.trim();
    const village = form.village.trim();
    const count = Number(form.memberCount);

    if (!name || !village || form.memberCount === "") {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    if (name.length > 100 || village.length > 100) {
      showMessage(
        "Cooperative name and village must be 100 characters or fewer.",
        "error"
      );
      return;
    }

    if (!Number.isInteger(count) || count < 0) {
      showMessage(
        "Member count must be a non-negative whole number.",
        "error"
      );
      return;
    }

    const payload = {
      cooperativeName: name,
      village,
      memberCount: count,
      registered: form.registered === "true",
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await axios.put(`${API}/update/${editingId}`, payload);
        showMessage("Farmer cooperative updated successfully.", "success");
      } else {
        await axios.post(`${API}/add`, payload);
        showMessage("Farmer cooperative added successfully.", "success");
      }

      resetForm();
      await loadRecords();
    } catch (error) {
      const data = error.response?.data;
      const errorText =
        typeof data === "string" ? data : data?.message;

      showMessage(
        errorText || "Unable to save the record. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      cooperativeName: record.cooperativeName ?? "",
      village: record.village ?? "",
      memberCount: String(record.memberCount ?? ""),
      registered: record.registered ? "true" : "false",
    });

    document.getElementById("cooperative-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cooperative?")) {
      return;
    }

    try {
      await axios.delete(`${API}/delete/${id}`);

      showMessage("Farmer cooperative deleted successfully.", "success");

      if (editingId === id) {
        resetForm();
      }

      if (lookupRecord?.id === id) {
        setLookupRecord(null);
      }

      await loadRecords();
    } catch (error) {
      const data = error.response?.data;
      const errorText =
        typeof data === "string" ? data : data?.message;

      showMessage(
        errorText || "Unable to delete the record. Please try again.",
        "error"
      );
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();

    setLookupRecord(null);

    const idText = lookupId.trim();
    const id = Number(idText);

    if (!idText || !Number.isInteger(id) || id <= 0) {
      showMessage("Please enter a valid Cooperative ID.", "error");
      return;
    }

    setSearching(true);

    try {
      const response = await axios.get(`${API}/display/id/${id}`);
      const data = response.data;

      if (
        !data ||
        typeof data !== "object" ||
        data.id === undefined ||
        data.id === null ||
        Number(data.id) !== id
      ) {
        showMessage(`No cooperative found with ID ${id}.`, "error");
        return;
      }

      setLookupRecord(data);
      showMessage("Cooperative record found successfully.", "success");
    } catch (error) {
      if (error.response?.status === 404) {
        showMessage(`No cooperative found with ID ${id}.`, "error");
      } else {
        showMessage(
          "Unable to search for the cooperative. Please try again.",
          "error"
        );
      }
    } finally {
      setSearching(false);
    }
  };

  const totalMembers = records.reduce(
    (total, record) => total + (Number(record.memberCount) || 0),
    0
  );

  const registeredCount = records.filter(
    (record) => record.registered
  ).length;

  return (
    <div className="farm-page">
      <nav className="farm-navbar">
        <div className="farm-brand">FarmConnect</div>

        <div className="farm-nav-links">
          <a href="#home">Home</a>
          <a href="#cooperative-form">Add Cooperative</a>
          <a href="#directory">Directory</a>
        </div>
      </nav>

      <main className="farm-container" id="home">
        <section className="farm-hero">
          <p className="farm-eyebrow">
            FARMERS COOPERATIVE MANAGEMENT
          </p>

          <h1>Growing Together, Stronger Together</h1>

          <p>
            Manage farmer cooperatives, track membership, and keep your
            community records organized in one place.
          </p>

          <a className="farm-hero-button" href="#cooperative-form">
            + Add a Cooperative
          </a>
        </section>

        {message && (
          <div
            className={`farm-alert ${messageType}`}
            role={messageType === "error" ? "alert" : "status"}
          >
            <span>{message}</span>

            <button
              type="button"
              aria-label="Close notification"
              onClick={() => setMessage("")}
            >
              ×
            </button>
          </div>
        )}

        <section className="farm-stats">
          <div className="farm-stat">
            <span>Total Cooperatives</span>
            <strong>{records.length}</strong>
            <small>All records</small>
          </div>

          <div className="farm-stat">
            <span>Total Members</span>
            <strong>{totalMembers}</strong>
            <small>Across all cooperatives</small>
          </div>

          <div className="farm-stat">
            <span>Registered</span>
            <strong>{registeredCount}</strong>
            <small>Officially registered</small>
          </div>

          <div className="farm-stat">
            <span>Not Registered</span>
            <strong>{records.length - registeredCount}</strong>
            <small>Awaiting registration</small>
          </div>
        </section>

        <section className="farm-workspace">
          <div className="farm-panel" id="cooperative-form">
            <p className="farm-section-label">COOPERATIVE DETAILS</p>

            <h2>
              {editingId !== null ? "Edit Cooperative" : "Add a Cooperative"}
            </h2>

            <p className="farm-muted">Fields marked * are required.</p>

            <form onSubmit={handleSubmit}>
              <div className="farm-field">
                <label htmlFor="cooperativeName">
                  Cooperative Name *
                </label>

                <input
                  id="cooperativeName"
                  name="cooperativeName"
                  value={form.cooperativeName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="Enter cooperative name"
                />
              </div>

              <div className="farm-field">
                <label htmlFor="village">Village *</label>

                <input
                  id="village"
                  name="village"
                  value={form.village}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="Enter village name"
                />
              </div>

              <div className="farm-field">
                <label htmlFor="memberCount">Number of Members *</label>

                <input
                  id="memberCount"
                  name="memberCount"
                  type="number"
                  min="0"
                  step="1"
                  value={form.memberCount}
                  onChange={handleChange}
                  required
                  placeholder="Enter member count"
                />
              </div>

              <div className="farm-field">
                <label htmlFor="registered">Registration Status *</label>

                <select
                  id="registered"
                  name="registered"
                  value={form.registered}
                  onChange={handleChange}
                  required
                >
                  <option value="true">Registered</option>
                  <option value="false">Not Registered</option>
                </select>
              </div>

              <div className="farm-form-actions">
                <button className="farm-primary-button" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Cooperative"
                    : "Add Cooperative"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    className="farm-secondary-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="farm-panel farm-lookup">
            <p className="farm-section-label">QUICK SEARCH</p>

            <h2>Find a Cooperative</h2>

            <p className="farm-muted">
              Search for an existing record using its ID.
            </p>

            <form onSubmit={handleLookup}>
              <div className="farm-field">
                <label htmlFor="lookupId">Cooperative ID</label>

                <input
                  id="lookupId"
                  type="number"
                  min="1"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="Enter cooperative ID"
                />
              </div>

              <button
                className="farm-primary-button"
                disabled={searching}
              >
                {searching ? "Searching..." : "Find Cooperative"}
              </button>
            </form>

            {lookupRecord && (
              <div className="farm-lookup-result">
                <h3>{lookupRecord.cooperativeName}</h3>
                <p><strong>ID:</strong> {lookupRecord.id}</p>
                <p><strong>Village:</strong> {lookupRecord.village}</p>
                <p><strong>Members:</strong> {lookupRecord.memberCount}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {lookupRecord.registered
                    ? "Registered"
                    : "Not Registered"}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="farm-panel farm-directory" id="directory">
          <div className="farm-directory-heading">
            <div>
              <p className="farm-section-label">YOUR DATABASE</p>
              <h2>Cooperative Directory</h2>
              <p className="farm-muted">
                View and manage all cooperative records.
              </p>
            </div>

            <span className="farm-record-count">
              {records.length} {records.length === 1 ? "record" : "records"}
            </span>
          </div>

          {loading ? (
            <p className="farm-empty">Loading cooperative records...</p>
          ) : records.length === 0 ? (
            <p className="farm-empty">
              No cooperative records to display yet.
            </p>
          ) : (
            <div className="farm-table-wrapper">
              <table className="farm-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cooperative Name</th>
                    <th>Village</th>
                    <th>Members</th>
                    <th>Registration</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.cooperativeName}</td>
                      <td>{record.village}</td>
                      <td>{record.memberCount}</td>
                      <td>
                        <span
                          className={`farm-status ${
                            record.registered
                              ? "registered"
                              : "unregistered"
                          }`}
                        >
                          {record.registered
                            ? "Registered"
                            : "Not Registered"}
                        </span>
                      </td>
                      <td>
                        <div className="farm-row-actions">
                          <button
                            type="button"
                            className="farm-edit-button"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="farm-delete-button"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="farm-footer">
          FarmConnect · Farmer Cooperative Management System
        </footer>
      </main>
    </div>
  );
}
