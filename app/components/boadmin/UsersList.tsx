import { Datagrid, DateField, EmailField, List, TextField } from 'react-admin';

export default function UsersList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        {/* <TextField source="id" /> */}
        <EmailField source="email" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </Datagrid>
    </List>
  )
}