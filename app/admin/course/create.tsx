import {
  Create,
  required,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
} from "react-admin";
export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Title" />
        <TextInput source="imageSrc" validate={[required()]} label="Image" />
        {/* <ImageInput source="pictures" label="Related pictures">
          <ImageField source="src" title="title" />
        </ImageInput> */}
      </SimpleForm>
    </Create>
  );
};
