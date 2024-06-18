import { useState, useEffect, } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField, Typography, Box, Container} from '@mui/material';


function App() {
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);
  const [createContact, setCreateContact] = useState({ name: '', phone_number: '' });


  const fetchContacts = () => {
    axios.get('http://localhost:5001/api/contacts')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the contacts!', error);
      });
  };

  // Fetch contacts from the server
  useEffect(() => {
    axios.get('http://localhost:5001/api/contacts')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the contacts!', error);
      });
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSave = () => {
    // Check if contact already exists
    const contactExists = contacts.some(contact =>
      contact.name === createContact.name && contact.phone_number === createContact.phone_number
    );
  
    if (contactExists) {
      console.error('Contact already exists!');
      return;
    }
  
    axios.post('http://localhost:5001/api/create-contact', createContact)
      .then(response => {
        console.log('Contact saved successfully');
        // Optionally clear the input fields after saving
        setCreateContact({ name: '', phone_number: '' });
        fetchContacts(); // Refetch contacts after deleting
      })
      .catch(error => {
        console.error('There was an error saving the contact!', error);
      });
  };

  const handleDelete = (name, phone_number) => {
    axios.delete('http://localhost:5001/api/delete', { data: { name, phone_number } })
      .then(response => {
        console.log('Contact deleted successfully');
        fetchContacts(); // Refetch contacts after deleting
      })
      .catch(error => {
        console.error('There was an error deleting the contact!', error);
      });
  };

  // Edit contact
  const handleEditContact = (id) => {
    const contactToEdit = contacts.find(contact => contact._id === id);
    setEditContact(contactToEdit);
  };

  // Save edited contact
  const handleSaveEdit = (id) => {
    axios.put(`http://localhost:5001/api/edit-contact/${id}`, editContact)
      .then(response => {
        setContacts(contacts.map(contact => contact._id === id ? response.data : contact));
        setEditContact(null);
      })
      .catch(error => {
        console.error('There was an error updating the contact!', error);
      });
  };

  // Delete contact
  const handleDeleteContact = (id) => {
    axios.delete(`http://localhost:5001/api/delete-contact/${id}`)
      .then(() => {
        setContacts(contacts.filter(contact => contact._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the contact!', error);
      });
  };


  return (
    <>
    <Container>
      <Box
        sx={{
          display: 'flex',
          gap: '100px',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}
      >

        <Typography>Add / Delete Data</Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Phone Number</TableCell>
                  <TableCell align="right">Add / Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <TextField
                      value={createContact.name}
                      onChange={(e) => setCreateContact({ ...createContact, name: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={createContact.phone_number}
                      onChange={(e) => setCreateContact({ ...createContact, phone_number: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={handleSave}>+</Button>
                    <Button onClick={() => handleDelete(createContact.name, createContact.phone_number)}>-</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

        <Typography>Phone Book</Typography>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right">Modify Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow
                  key={contact._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell align="right">
                    {editContact && editContact._id === contact._id ? (
                      <TextField
                        value={editContact.name}
                        onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                      />
                    ) : (
                      contact.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editContact && editContact._id === contact._id ? (
                      <TextField
                        value={editContact.phone_number}
                        onChange={(e) => setEditContact({ ...editContact, phone_number: e.target.value })}
                      />
                    ) : (
                      contact.phone_number
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editContact && editContact._id === contact._id ? (
                      <Button onClick={() => handleSaveEdit(contact._id)}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEditContact(contact._id)}>Edit</Button>
                    )}
                    <Button onClick={() => handleDeleteContact(contact._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </Container>
    </>
  );
}

export default App;
