import { useState } from "react";

export default function CreatePostForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    time: "",
    experationTime: "",
    repOrSwipe: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Post created successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        time: "",
        experationTime: "",
        repOrSwipe: false,
      });
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <br />
        <label>
          Start Time:
          <input
            type="datetime-local"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Expiration Time:
          <input
            type="datetime-local"
            name="experationTime"
            value={form.experationTime}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Is this a Meal Swipe?
          <input
            type="checkbox"
            name="repOrSwipe"
            checked={form.repOrSwipe}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
