import { Datagrid, DateField, EmailField, TextField } from "react-admin";
import ListLayout from '../admin/ListLayout';

export default function UsersList() {
  return (
    <ListLayout>
      <Datagrid rowClick="edit">
        {/* <TextField source="id" /> */}
        <EmailField source="email" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </Datagrid>
    </ListLayout>
  );
}
