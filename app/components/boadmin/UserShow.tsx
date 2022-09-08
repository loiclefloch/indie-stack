// see https://marmelab.com/react-admin/Show.html
import { Show, SimpleShowLayout, TextField, DateField, EmailField } from 'react-admin';
import Aside from './UserAside';

export default function UserShow() {
  return (
    <Show aside={<Aside />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="firstName" />
        <TextField source="lastName" />

        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </SimpleShowLayout>
    </Show>
  );
}