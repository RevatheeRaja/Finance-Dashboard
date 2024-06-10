import * as React from 'react'
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs"; //KENDO DIALOG COMPONENT
import {
  Form,
  Field,
  FormElement,
  FieldWrapper,
} from "@progress/kendo-react-form"; //KENDO FORM COMPONENT
import { TextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import { Error, Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";
import { cancelIcon, saveIcon } from "@progress/kendo-svg-icons";
const TextBoxField = (fieldRenderProps) => {
  const { validationMessage, visited, label, id, valid, ...others } =
    fieldRenderProps;
  return (
    <>
      <Label editorId={id} className={"k-form-label"}>
        {label}
      </Label>
      <div className={"k-form-field-wrap"}>
        <TextBox {...others} />
      </div>
    </>
  );
};

const BankChangeForm = (props) => {
  const { cancelEdit, onSubmit, ...other } = props;
  return (
    <Form
      onSubmit={onSubmit}
      render={(renderProps) => (
        /*****INITIALIZE THE DIALOG BOX N SIZE */
        <Dialog
          onClose={cancelEdit}
          //title={`Edit ${item.thema}`}
          style={{
            maxWidth: "650px",
          }}
        >
          <FormElement>
            <FieldWrapper>
              <Field component={TextBoxField} label={"IBAN"} />
            </FieldWrapper>
            <FieldWrapper>
              <Field component={TextBoxField} label={"BIC"} />
            </FieldWrapper>
            
          </FormElement>
          {/* DIALOG ACTION BAR  */}
          <DialogActionsBar layout="start">
            <Button
              type={"submit"}
              themeColor={"primary"}
              disabled={!renderProps.allowSubmit}
              onClick={renderProps.onSubmit}
              icon="save"
              svgIcon={saveIcon}
            >
              Update
            </Button>
            <Button onClick={cancelEdit} icon="cancel" svgIcon={cancelIcon}>
              Cancel
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
      {...other}
    />
  );
}

export default BankChangeForm