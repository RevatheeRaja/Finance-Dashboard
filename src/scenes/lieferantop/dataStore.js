// dataStore.js
export let selectedRows = [];
let deletedRows = []; // New array to store deleted rows
export const getSelectedRows = () => selectedRows;
export const getDeletedRows = () => deletedRows;

export const addSelectedRows = (rows) => {
  selectedRows.push(...rows);
};

 export const removeSelectedRow = (row) => {
  deletedRows.push(row);
  selectedRows = selectedRows.filter(
    (item) => item.interneBelegnummer !== row.interneBelegnummer
  );
   // Log the deleted rows
   console.log('Deleted rows:', deletedRows);
};
/* export const removeSelectedRow = (row) => {
    console.log("Removing row:", row);
    selectedRows = selectedRows.filter(
      (item) => {
        console.log("Comparing with:", item);
        const isEqual = item.interneBelegnummer === row.interneBelegnummer;
        console.log("Is equal:", isEqual);
        return !isEqual;
      }
    );
    console.log("Selected rows after removal:", selectedRows);
  }; */

export const resetSelectedRows = () => {
  const rows = [...selectedRows];
  selectedRows = [];
  return rows;
};
