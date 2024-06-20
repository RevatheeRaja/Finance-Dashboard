import React, { useState, useEffect, useCallback, useRef } from "react";
/* /********DUMMY DATA FOR TEST****************** */
/* import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";

  export const sumBetrag = mockverbindlichkeit.reduce((total, item) => total + item.betrag, 0);
  
  export const sumBankeinzuge = mockverbindlichkeit.reduce((total, item) => {
    if (item.zahlungsart === "A" || item.zahlungsart === "E") {
      return total + item.betrag;
    }
    return total;
  }, 0); */
  // Function to fetch data from the API with error handling
const fetchData = async () => {
  try {
    const response = await fetch("https://fibutronwebapi.fibutron.de/api/operation-process/get-verbindlichkeit-inforamtion?Mandantnummer=923");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return []; // Return an empty array or handle the error as needed
  }
};

// Function to calculate sumBetrag
const calculateSumBetrag = async () => {
  const data = await fetchData();
  return data.reduce((total, item) => total + item.betrag, 0);
};

// Function to calculate sumBankeinzuge
const calculateSumBankeinzuge = async () => {
  const data = await fetchData();
  return data.reduce((total, item) => {
    if (item.zahlungsart === "A" || item.zahlungsart === "E") {
      return total + item.betrag;
    }
    return total;
  }, 0);
};

// Exporting the promises
export const sumBetrag = calculateSumBetrag();
export const sumBankeinzuge = calculateSumBankeinzuge();
