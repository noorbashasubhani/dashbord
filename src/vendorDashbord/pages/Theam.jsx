import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { API_URL } from '../data/apiUrl';

const Theam = () => {
  const [themes, setThemes] = useState([]);
  const [formData, setFormData] = useState({
    destination_name: '',
    holiday_type: '',
    imges: null,
    status: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchThemes = async () => {
    const res = await fetch(`${API_URL}/flyer/Thems`);
    const data = await res.json();
    const themesArray = Array.isArray(data.data) ? data.data : [data.data];
    setThemes(themesArray);
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imges') {
      const file = files[0];
      setFormData({ ...formData, imges: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('destination_name', formData.destination_name);
    form.append('holiday_type', formData.holiday_type);
    form.append('status', formData.status === 'Active' ? 'Y' : 'N');
    if (formData.imges) form.append('imges', formData.imges);

    const endpoint = editingId
      ? `${API_URL}/flyer/Thems/${editingId}`
      : `${API_URL}/flyer/Thems`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      body: form,
    });

    if (res.ok) {
      fetchThemes();
      setFormData({ destination_name: '', holiday_type: '', imges: null, status: '' });
      setPreviewImage(null);
      setEditingId(null);
    }
  };

  const handleEdit = (theme) => {
    setFormData({
      destination_name: theme.destination_name,
      holiday_type: theme.holiday_type,
      imges: null,
      status: theme.status === 'Y' ? 'Active' : 'Inactive',
    });
    setPreviewImage(theme.imges); // show image preview
    setEditingId(theme._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theme?')) return;
    await fetch(`${API_URL}/flyer/Thems/${id}`, { method: 'DELETE' });
    fetchThemes();
  };

  const columns = [
    { name: 'Destination', selector: row => row.destination_name },
    { name: 'Holiday Type', selector: row => row.holiday_type },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.imges}
          alt="theme"
          width="80"
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      name: 'Status',
      selector: row => (row.status === 'Y' ? 'Active' : 'Inactive'),
    },
    {
      name: 'Created',
      selector: row => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button onClick={() => handleEdit(row)} className="btn btn-sm btn-warning me-2">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-danger">Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h3>Theme Manager</h3>
      <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Destination Name"
          name="destination_name"
          className="form-control mb-2"
          value={formData.destination_name}
          onChange={handleChange}
          required
        />

        <select
          name="holiday_type"
          className="form-control mb-2"
          value={formData.holiday_type}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Holiday Type --</option>
          <option value="Domestic">Domestic</option>
          <option value="International">International</option>
        </select>

        <input
          type="file"
          name="imges"
          className="form-control mb-2"
          onChange={handleChange}
          accept="image/*"
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="preview"
            width="100"
            className="mb-2 d-block"
          />
        )}

        <select
          name="status"
          className="form-control mb-2"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Status --</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update' : 'Add'} Theme
        </button>
      </form>

      <DataTable
        title="Theme List"
        columns={columns}
        data={themes}
        pagination
      />
    </div>
  );
};

export default Theam;
