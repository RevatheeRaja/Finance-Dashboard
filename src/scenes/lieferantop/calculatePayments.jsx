import React, { useState, useEffect, useCallback, useRef } from "react";
/********DUMMY DATA FOR TEST****************** */
import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";

  export const sumBetrag = mockverbindlichkeit.reduce((total, item) => total + item.betrag, 0);
  
  export const sumBankeinzuge = mockverbindlichkeit.reduce((total, item) => {
    if (item.zahlungsart === "A" || item.zahlungsart === "E") {
      return total + item.betrag;
    }
    return total;
  }, 0);