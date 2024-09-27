import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
export const CourseSectionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" validate={[required()]} label="Id" />
        <ReferenceInput source="courseId" reference="courses" />
        <ReferenceInput source="sectionId" reference="sections" />
        <TextInput
          source="sectionPhrase"
          validate={[required()]}
          label="Description"
        />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};
