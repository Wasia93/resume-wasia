"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    email: "",
    phone: "",
    street: "",
    block: "",
    city: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [education, setEducation] = useState<string[]>([""]);
  const [experience, setExperience] = useState<string[]>([""]);
  const [skills, setSkills] = useState<string[]>([""]);

 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDynamicChange = (
    index: number,
    value: string,
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    stateSetter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddField = (
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    stateSetter((prev) => [...prev, ""]);
  };

  const handleRemoveField = (
    index: number,
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    stateSetter((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Profile Picture Upload
  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfilePicture(file || null);
  };

  // PDF Download Handler
  const handleDownload = () => {
    const doc = new jsPDF();

    // Add Profile Picture
    if (profilePicture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imgData = e.target.result as string;
          doc.addImage(imgData, "JPEG", 150, 10, 40, 40); 
          generatePDFContent(doc);
        }
      };
      reader.readAsDataURL(profilePicture);
    } else {
      generatePDFContent(doc);
    }
  };

  const generatePDFContent = (doc: jsPDF) => {
    let yPosition = 20; 

 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(formData.name || "Your Name", 105, yPosition, { align: "center" });
    yPosition += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Profile Summary:", 10, yPosition);
    yPosition += 10;
    const wrappedSummary = doc.splitTextToSize(formData.summary, 180);
    doc.text(wrappedSummary, 10, yPosition);
    yPosition += wrappedSummary.length * 10;

    doc.text(`Email: ${formData.email}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${formData.phone}`, 10, yPosition);
    yPosition += 10;
    doc.text(
      `Address: ${formData.street}, ${formData.block}, ${formData.city}`,
      10,
      yPosition
    );
    yPosition += 10;

    yPosition += 10; 
    const sections = [
      { title: "Education", data: education },
      { title: "Experience", data: experience },
      { title: "Skills", data: skills },
    ];

    sections.forEach((section) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${section.title}:`, 10, yPosition);
      yPosition += 10;

      doc.setFont("helvetica", "normal");
      section.data.forEach((item, index) => {
        const wrappedItem = doc.splitTextToSize(`${index + 1}. ${item}`, 180);
        doc.text(wrappedItem, 10, yPosition);
        yPosition += wrappedItem.length * 10;
      });

      yPosition += 10;
    });

    doc.save("resume.pdf");
  };

  return (
    <div
      style={{
        backgroundImage: 'url("https://wallpapercave.com/wp/wp6079843.gif")',
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
          width: "100%",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Build Your Resume by Wasia Haris
        </h2>

        
        <label>Upload Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicture}
          style={{ marginBottom: "20px", display: "block" }}
        />

   
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <textarea
          name="summary"
          placeholder="Profile Summary"
          value={formData.summary}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <input
          type="text"
          name="street"
          placeholder="Street Name"
          value={formData.street}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <input
          type="text"
          name="block"
          placeholder="Block No/House No"
          value={formData.block}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <input
          type="text"
          name="city"
          placeholder="Area/City"
          value={formData.city}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "10px", width: "95%" }}
        />

  
        {[
          { title: "Education", state: education, setState: setEducation },
          { title: "Experience", state: experience, setState: setExperience },
          { title: "Skills", state: skills, setState: setSkills },
        ].map((section, idx) => (
          <div key={idx}>
            <h2>{section.title}</h2>
            {section.state.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  value={item}
                  placeholder={`${section.title} ${index + 1}`}
                  onChange={(e) =>
                    handleDynamicChange(index, e.target.value, section.setState)
                  }
                  style={{ padding: "10px", width: "95%" }}
                />
                <button
                  onClick={() =>
                    handleRemoveField(index, section.setState)
                  }
                  style={{
                    color: "white",
                    border: "none",
                    backgroundColor: "red",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddField(section.setState)}
              style={{
                backgroundColor: "#1E90FF",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              Add {section.title}
            </button>
          </div>
        ))}

        <button
          onClick={handleDownload}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeBuilder;