import React from "react";
import { Box, Button, useTheme } from "@mui/material";

import Header from "../../components/Headers";
//the color palletes
import { ColorModeContext, tokens } from "../../theme";
import { useEffect, useRef, useState } from "react";

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { extend } from "@syncfusion/ej2-base";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

import * as dataSource from "../../data/mockKanban";
import { PropertyPane } from "./property-pane";
const Workflow = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let data = extend([], dataSource.kanbanData, true);
  let kanbanObj = useRef(null);

  const addClick = () => {
    const cardIds = kanbanObj.current.kanbanData.map((obj) =>
      parseInt(obj.Id.replace("Task ", ""), 10)
    );
    const cardCount = Math.max.apply(Math, cardIds) + 1;
    const cardDetails = {
      Id: "Task " + cardCount,
      Status: "Open",
      Priority: "Normal",
      Assignee: "Andrew Fuller",
      Estimate: 0,
      Tags: "",
      Summary: "",
    };
    kanbanObj.current.openDialog("Add", cardDetails);
  };

  const KanbanDialogFormTemplate = (props) => {
    // useEffect(() => {
    //   //updateSampleSection();
    // }, []);
    let assigneeData = [
      "Nancy Davloio",
      "Andrew Fuller",
      "Janet Leverling",
      "Steven walker",
      "Robert King",
      "Margaret hamilt",
      "Michael Suyama",
    ];
    let statusData = ["Open", "InProgress", "Testing", "Close"];
    let priorityData = ["Low", "Normal", "Critical", "Release Breaker", "High"];
    let tagsHtmlAttributes = { name: "Tags" };
    const [state, setState] = useState(extend({}, {}, props, true));
    const onChange = (args) => {
      let key = args.target.name;
      let value = args.target.value;
      setState({ [key]: value });
    };
    let data = state;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td className="e-label">ID</td>
              <td>
                <div className="e-float-input e-control-wrapper">
                  <input
                    id="Id"
                    name="Id"
                    type="text"
                    className="e-field"
                    value={data.Id}
                    disabled
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="e-label">Status</td>
              <td>
                <DropDownListComponent
                  id="Status"
                  name="Status"
                  dataSource={statusData}
                  className="e-field"
                  placeholder="Status"
                  value={data.Status}
                ></DropDownListComponent>
              </td>
            </tr>
            <tr>
              <td className="e-label">Assignee</td>
              <td>
                <DropDownListComponent
                  id="Assignee"
                  name="Assignee"
                  className="e-field"
                  dataSource={assigneeData}
                  placeholder="Assignee"
                  value={data.Assignee}
                ></DropDownListComponent>
              </td>
            </tr>
            
            <tr>
              <td className="e-label">Priority</td>
              <td>
                <DropDownListComponent
                  type="text"
                  name="Priority"
                  id="Priority"
                  popupHeight="300px"
                  className="e-field"
                  value={data.Priority}
                  dataSource={priorityData}
                  placeholder="Priority"
                ></DropDownListComponent>
              </td>
            </tr>
            <tr>
              <td className="e-label">Summary</td>
              <td>
                <div className="e-float-input e-control-wrapper">
                  <textarea
                    name="Summary"
                    className="e-field"
                    value={data.Summary}
                    onChange={onChange.bind(this)}
                  ></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  const dialogTemplate = (props) => {
    return <KanbanDialogFormTemplate {...props} />;
  };
  return (
    <div className="kanban-control-section">
      <div className="col-lg-3 property-section">
        <PropertyPane>
          <table id="property">
            <tbody>
              <tr>
                <td>
                  <ButtonComponent
                    id="addNew"
                    className="e-btn e-dialog-add"
                    onClick={addClick.bind(this)}
                    style={{ backgroundColor: '#3788d8', color: '#ffffff' }}
                  >
                    Add New Card
                  </ButtonComponent>
                </td>
              </tr>
            </tbody>
          </table>
        </PropertyPane>
      </div>
      <div className="col-lg-9 control-section">
        <div className="control-wrapper">
          <div className="kanban-section">
            <KanbanComponent
              id="kanban"
              ref={kanbanObj}
              keyField="Status"
              dataSource={data}
              cardSettings={{
                contentField: "Summary",
                headerField: "Id",
                grabberField: "Color",
              }}
              dialogSettings={{ template: dialogTemplate.bind(this) }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  headerText="To Do"
                  keyField="Open"
                  allowToggle={true}
                />
                <ColumnDirective
                  headerText="In Progress"
                  keyField="InProgress"
                  allowToggle={true}
                />
                <ColumnDirective
                  headerText="Testing"
                  keyField="Testing"
                  allowToggle={true}
                />
                <ColumnDirective
                  headerText="Done"
                  keyField="Close"
                  allowToggle={true}
                />
              </ColumnsDirective>
            </KanbanComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflow;