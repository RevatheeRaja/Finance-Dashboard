//imports
import * as React from "react";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs"; //KENDO DIALOG COMPONENT
import {
  Form,
  Field,
  FormElement,
  FieldWrapper,
} from "@progress/kendo-react-form"; //KENDO FORM COMPONENT
//KENDO INPUT COMPONENTS
import { TextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
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

const EditForm = (props) => {
  const { cancelEdit, onSubmit, item, ...other } = props;
  return (
    <Form
      initialValues={props.item}
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
              <Label editorId={"Markierung"} className={"k-form-label"}>
                {" "}
                {"Markierung"}
              </Label>
              <div className={"k-form-field-wrap"}>
                <Field
                  id={"Markierung"}
                  name={"markierung"}
                  component={DropDownList}
                  data={[
                    "",
                    "Important",
                    "Read",
                    "Red Category",
                    "Blue Category",
                    "Green Category",
                  ]}
                />
              </div>
            </FieldWrapper>
            <FieldWrapper>
              <Field name={"thema"} component={TextBoxField} label={"Thema"} />
            </FieldWrapper>
            <FieldWrapper>
              <Field name={"name"} component={TextBoxField} label={"Name"} />
            </FieldWrapper>
            <FieldWrapper>
              <Field
                name={"strasse"}
                component={TextBoxField}
                label={"Strasse"}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Field name={"ort"} component={TextBoxField} label={"Ort"} />
            </FieldWrapper>
            <FieldWrapper>
              <Field
                name={"belegnummer"}
                component={TextBoxField}
                label={"Belegnummer"}
              />
            </FieldWrapper>

            {/* <FieldWrapper>
              <fieldset>
                <DatePicker
                  placeholder="Dokumentendatum"
                  name={"dokumentendatum"}
                />
              </fieldset>
            </FieldWrapper> */}
            <FieldWrapper>
              <Field
                name={"notizen"}
                component={TextBoxField}
                label={"Notizen"}
              />
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
};
export default EditForm;
