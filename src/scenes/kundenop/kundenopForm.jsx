import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  Form,
  Field,
  FormElement,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { TextBox } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";

import { totalBetragBeforeToday, sumBetrag } from "./calculatePayments";
const KundenopForm = () => {
  const handleMahnwesen = () => {};
  return (
    <Box>
      <Form
        initialValues={{ amount: 0 }}
        render={(renderProps) => (
          <FormElement>
            {/* <FieldWrapper>
              <Label editorId={"amount"} className={"k-form-label"}>
                Summe Betrag{" "}
              </Label>
              <TextBox
                style={{ margin: "20px 0", color: "#2196f3" }}
                id="amount"
                name="amount"
                value={sumBetrag}
                disabled
              />
            </FieldWrapper> */}
            <FieldWrapper>
              <Label editorId={"faelligamount"} className={"k-form-label"}>
                Summe Faellig Betrag{" "}
              </Label>
              <TextBox
                style={{ margin: "20px 0", color: "#ff9800" }}
                id="faelligamount"
                name="faelligamount"
                value={totalBetragBeforeToday}
                disabled
              />
            </FieldWrapper>
          </FormElement>
        )}
      />
      {/* <div className="export-btns-container">
        <h2 style={{ margin: "20px" , textAlign: "center",color:"#2196f3", fontWeight:"bold" }} >Mahnsystem</h2>
        <Button onClick={handleMahnwesen} style={{ width: '100%' }}>Mahnwesen</Button>
      </div> */}
    </Box>
  );
};

export default KundenopForm;
