import { useState } from "react";
import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  Pagination,
} from "react-admin";

const UnitPagination = () => (
  <Pagination rowsPerPageOptions={[5, 10, 25, 50, 100]} />
);

export const UnitList = () => {
  return (
    <List perPage={5} pagination={<UnitPagination />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ReferenceField
          source="courseSectionId"
          reference="courseSections"
          label="Section"
        />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
