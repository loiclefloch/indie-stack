// see https://marmelab.com/react-admin/Show.html
import { Edit, SimpleForm, TextInput, DateInput, required } from 'react-admin';
import Aside from './UserAside';

export default function UserEdit() {
  return (
    <Edit aside={<Aside />}>
      <SimpleForm>
        <TextInput  source="id" disabled validate={required()} fullWidth />
        <TextInput source="email" type="email" validate={required()} fullWidth/>
        <DateInput source="createdAt" label="createdAt" disabled validate={required()} fullWidth/>
        <DateInput source="updatedAt" label="updatedAt" disabled validate={required()} fullWidth/>
      </SimpleForm>
    </Edit>
  );
}
