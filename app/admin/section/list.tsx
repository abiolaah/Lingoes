import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";
export const SectionList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="level" />
        <TextField source="description" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
