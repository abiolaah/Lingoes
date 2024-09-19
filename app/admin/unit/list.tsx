import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";
export const UnitList = () => {
  return (
    <List>
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
