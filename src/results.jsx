// ResultSidebar.jsx
import React, { useState, useEffect } from 'react';

const classWeights = {
  unripe_green: 0,
  early_ripening: 1,
  mid_ripening: 2,
  ripe_ready: 3,
  late_ripe: 4,
  overripe_rotting: 5
};

const shelfLifeByStage = [
  20, // unripe_green
  15, // early_ripening
  10, // mid_ripening
  6,  // ripe_ready
  3,  // late_ripe
  1   // overripe_rotting
];

const classDisplayOrder = [
  "early_ripening",
  "mid_ripening",
  "ripe_ready",
  "late_ripe",
  "overripe_rotting",
  "unripe_green"
];

const ResultSidebar = ({ apiResponse }) => {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(35);
  const [shelfLife, setShelfLife] = useState(null);
  const [classCount, setClassCount] = useState({});

  const calculateShelfLife = (avgClassIndex, temperature, humidity) => {
    const baseShelfLife = shelfLifeByStage[avgClassIndex];

    const R = 8.314;
    const Ea = 40000;
    const tempKelvin = temperature + 273.15;

    const referenceTemp = 25 + 273.15;
    const rateAtT = Math.exp(-Ea / (R * tempKelvin));
    const rateAtRef = Math.exp(-Ea / (R * referenceTemp));
    const tempModifier = rateAtRef / rateAtT;

    let humidityModifier = 1;
    if (humidity > 35) {
      humidityModifier = 1 - (humidity - 35) * 0.01;
    } else if (humidity < 35) {
      humidityModifier = 1 + (35 - humidity) * 0.005;
    }

    humidityModifier = Math.min(Math.max(humidityModifier, 0.5), 1.5);

    const adjustedShelfLife = baseShelfLife * tempModifier * humidityModifier;
    return adjustedShelfLife.toFixed(1);
  };

  useEffect(() => {
    if (apiResponse?.outputs?.[0]?.predictions?.predictions) {
      const predictions = apiResponse.outputs[0].predictions.predictions;

      const newClassCount = {};
      predictions.forEach(pred => {
        const bananaClass = pred.class;
        newClassCount[bananaClass] = (newClassCount[bananaClass] || 0) + 1;
      });

      setClassCount(newClassCount);
    }
  }, [apiResponse]);

  const handlePredictShelfLife = () => {
    const total = Object.values(classCount).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const overripeCount = classCount['overripe_rotting'] || 0;
    const overripePercentage = (overripeCount / total) * 100;

    if (overripePercentage >= 60) {
      setShelfLife("❌ Rejected as the Batch is Overriped.");
      return;
    }

    let weightedSum = 0;
    Object.entries(classCount).forEach(([cls, count]) => {
      weightedSum += (classWeights[cls] || 0) * count;
    });

    const avgClassIndex = Math.round(weightedSum / total);
    const adjustedShelfLife = calculateShelfLife(avgClassIndex, temperature, humidity);
    setShelfLife(`${adjustedShelfLife} days`);
  };

  return (
    <div className="w-full md:w-64 p-4 bg-yellow-50 border-r md:h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">🍌 Prediction Summary</h2>

      {apiResponse?.outputs?.[0]?.count_objects ? (
        <p className="mb-2">Total Bananas Detected: <strong>{apiResponse.outputs[0].count_objects}</strong></p>
      ) : (
        <p>No results yet.</p>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">🍌 Count by Class:</h3>
        {classDisplayOrder.map(cls => (
          classCount[cls] !== undefined && (
            <p key={cls} className="text-sm">{cls.replace(/_/g, ' ')}: <strong>{classCount[cls]}</strong></p>
          )
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">🌡️ Temperature (°C)</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
        />

        <label className="block text-sm font-medium">💧 Humidity (%)</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          value={humidity}
          onChange={(e) => setHumidity(parseFloat(e.target.value))}
        />

        <button
          onClick={handlePredictShelfLife}
          className="w-full bg-green-600 text-white py-2 px-4 rounded mt-2 hover:bg-green-700"
        >
          🔍 Predict Shelf Life
        </button>

        {shelfLife && (
          <div
            className={`mt-4 font-semibold ${
              shelfLife.includes("Rejected") ? "text-red-600" : "text-green-700"
            }`}
          >
            📅 Predicted Shelf Life: <span>{shelfLife}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSidebar;
