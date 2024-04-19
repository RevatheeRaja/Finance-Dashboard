import React from "react";
import { mockAufgabenData } from "../../data/mockAufgaben";

// Extract all unique assignees from the mockAufgabenData
const allAssignees = mockAufgabenData.map(item => item.Assignee);
const uniqueAssignees = [...new Set(allAssignees)];
console.log(uniqueAssignees);


// Extract all unique status from the mockAufgabenData
const allStatus = mockAufgabenData.map(item => item.Status);
const uniqueStatus = [...new Set(allStatus)];
console.log(uniqueStatus);


export const dialogTemplate = `
  <table>
    <tbody>
      <tr>
        <td class="e-label">ID</td>
        <td><input id="Id" name="Id" type="text" class="e-field" value="" /></td>
      </tr>
      <tr>
        <td class="e-label">Status</td>
        <td>
          <select name="Status" id="Status" class="e-field">
          ${uniqueStatus.map(status => `<option>${status}</option>`).join('')}  
          </select>
        </td>
      </tr>
      <tr>
        <td class="e-label">Assignee</td>
        <td>
          <select name="Assignee" id="Assignee" class="e-field">
          ${uniqueAssignees.map(assignee => `<option>${assignee}</option>`).join('')}  
          </select>
        </td>
      </tr>
      <tr>
        <td class="e-label">Priority</td>
        <td>
          <input type="text" name="Priority" id="Priority" class="e-field" value=""/>
        </td>
      </tr>
      <tr>
        <td class="e-label">Summary</td>
        <td>
          <textarea type="text" name="Summary" id="Summary" class="e-field" value=""></textarea>
          <span class="e-float-line"></span>
        </td>
      </tr>
    </tbody>
  </table>
`;
