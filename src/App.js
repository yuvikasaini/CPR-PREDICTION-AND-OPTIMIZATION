import React, { useState } from "react";
import './App.css';  // Import the CSS file

const App = () => {
  const [formData, setFormData] = useState({
    city: "",
    timeOfDay: "",
    channel: "",
    type_of_device: "",
    type_of_cta: "",
  });
  
  const [ctr, setCtr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/predict_ctr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setCtr(data.predicted_ctr);
    } catch (error) {
      console.error("Error fetching CTR prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>CTR Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>City: </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            >
              <option value ="">Select a city</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Toronto">Toronto</option>
              <option value="Paris">Paris</option>
              <option value="Sydney">Sydney</option>
              <option value="Dubai">Dubai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Berlin">Berlin</option>
              <option value="Birmingham">Birmingham</option>
              </select>
        </div>


        <div>
          <label>Time of Day: </label>
          <select
            name="timeOfDay"
            value={formData.timeOfDay}
            onChange={handleChange}
            required
          >
            <option value="">Select time of day</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            </select>

        </div>


        <div>
          <label>Preferred Channel: </label>
          <select
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            required
          >
            <option value="">Select a channel</option>
            <option value="email">email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="sms"></option>
            </select>

        </div>



        <div>
          <label>Type of device: </label>
          <select
            name="type_of_device"
            value={formData.type_of_device}
            onChange={handleChange}
            required
          >
            <option value="">Select a device</option>
            <option value="Android">Android</option>
            <option value="iPhone">iPhone</option>
            </select>
        </div>



        <div>
          <label>Type of CTA: </label>
          <select
            name="type_of_cta"
            value={formData.type_of_cta}
            onChange={handleChange}
            required
          >
            <option value="">Select a CTA</option>
            <option value="book now">book now</option>
            <option value="know more">know more</option>
            <option value="purchase now">purchase now</option>
            <option value="order now">order now</option>
            <option value="buy now">buy now</option>
            </select>
        </div>
        <button type="submit">Get CTR Prediction</button>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        ctr && <h2 className="prediction">Predicted CTR: {ctr}%</h2>
      )}
    </div>
  );
};

export default App;
