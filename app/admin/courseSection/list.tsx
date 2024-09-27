import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";
export const CourseSectionList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ReferenceField source="courseId" reference="courses" />
        <ReferenceField source="sectionId" reference="sections" />
        <TextField source="sectionPhrase" />
        <TextField source="title" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
