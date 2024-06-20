import React, { useState, useEffect, useCallback, useRef } from "react";
/********DUMMY DATA FOR TEST****************** */


import { mockkundenop } from "../../data/mockKundenop";

const sumBetragBeforeToday = (data) => {
  const today = new Date();
  return data.reduce((sum, entry) => {
    return entry.Faellig && new Date(entry.Faellig) < today
      ? sum + entry.Betrag
      : sum;
  }, 0);
};
export const totalBetragBeforeToday = sumBetragBeforeToday(mockkundenop);
export const sumBetrag = mockkundenop.reduce((total, item) => total + item.Betrag, 0);


