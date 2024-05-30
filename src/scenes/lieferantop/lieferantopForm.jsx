import React, { useState, useEffect } from "react";
import { Form, Field, FormElement, FieldWrapper } from "@progress/kendo-react-form";
import { TextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";

//API URL 
//https://fibutronwebapi.fibutron.de/api/operation-process/get-verbindlichkeit-inforamtion?Mandantnummer=923

const mockData = {
  
  bankAccounts: [
    {
      accountId: "A001",
      bankName: "Bank Alpha",
      balance: 15000.00
    },
    {
      accountId: "A002",
      bankName: "Bank Beta",
      balance: 25000.25
    },
    {
      accountId: "A003",
      bankName: "Bank Gamma",
      balance: 30000.00
    }
  ]
};

const uniquePartnerNames = [...new Set(mockverbindlichkeit.map(item => item.name))];
console.log(uniquePartnerNames);
const LieferantopForm = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [bankBalance, setBankBalance] = useState(0);

  useEffect(() => {
    const bank = mockData.bankAccounts.find((bank) => bank.bankName === selectedBank);
    console.log(bank);
    setBankBalance(bank ? bank.balance : 0);
  }, [selectedBank]);
  //console.log(bankBalance);

  const handleBankChange = (event) => {
    setSelectedBank(event.value);
  }; //console.log(selectedBank);

  return (
    <Form
      initialValues={{ amount: 0 }}
      render={(renderProps) => (
        <FormElement>
          <FieldWrapper>
            <Label editorId={"Kreditor"} className={"k-form-label"}>
              Kreditor/Belegnummer filtern
            </Label>
            <div className={"k-form-field-wrap"}>
              <Field
                id={"Kreditor"}
                name={"kreditor"}
                component={DropDownList}
                //data={mockverbindlichkeit.map((item) => item.name)}
                data = {uniquePartnerNames}
              />
            </div>
          </FieldWrapper>
          <FieldWrapper>
            <Label editorId={"Konto"} className={"k-form-label"}>
              Konto wählen
            </Label>
            <div className={"k-form-field-wrap"}>
              <Field
                id={"Konto"}
                name={"konto"}
                component={DropDownList}
                data={mockData.bankAccounts.map((account) => account.bankName)}
                onChange={handleBankChange}
              />
            </div>
          </FieldWrapper>
          <FieldWrapper>
            <Label editorId={"amount"} className={"k-form-label"}>
              Kontostand </Label>
            <TextBox 
            id="amount"
            name="amount"
            value={bankBalance}/>
          </FieldWrapper>
        </FormElement>
      )}
    />
  );
};

export default LieferantopForm;
