import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
export const CourseSectionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <ReferenceInput source="courseId" reference="courses" />
        <ReferenceInput source="sectionId" reference="sections" />
        <TextInput
          source="sectionPhrase"
          validate={[required()]}
          label="Description"
        />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};
