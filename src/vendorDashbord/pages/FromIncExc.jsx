import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiUrl';
import Select from 'react-select';

export const FormIncExc = ({ row_id }) => {
  const [form, setForm] = useState({
    inclusions: [],
    exclusions: [], // 🔧 fix from []
    doc_id: row_id
  });

  const [inclusionOptions, setInclusionOptions] = useState([]);
  const [exclusionOptions, setExclusionOptions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    InsData();
    excData();
  }, []);

  useEffect(() => {
  if (row_id) {
    fetchExistingData();
  }
}, [inclusionOptions, exclusionOptions]);

const fetchExistingData = async () => {
  try {
    const res = await fetch(`${API_URL}/vendor/Form-inc-All/${row_id}`);
    if (!res.ok) throw new Error('Failed to fetch existing inc/exc');

    const json = await res.json();
    const data = json.data;

    if (data) {
      setForm({
        doc_id: row_id,
        inclusions: data.inclusions.map(value => ({
          label: value,
          value: value
        })),
        exclusions: data.exclusions.map(value => ({
          label: value,
          value: value
        }))
      });

      setIsEdit(true);
    }
  } catch (err) {
    console.error('Edit load error:', err.message);
  }
};


  const InsData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/incexc`);
      if (!res.ok) throw new Error('Inclusion data fetch failed');
      const json = await res.json();
      // map to react-select format
      setInclusionOptions(json.data.map(item => ({ label: item.name, value: item.name })));
    } catch (err) {
      console.error(err.message);
    }
  };

  const excData = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/incexc`);
      if (!res.ok) throw new Error('Exclusion data fetch failed');
      const json = await res.json();
      setExclusionOptions(json.data.map(item => ({ label: item.name, value: item.name })));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      inclusions: form.inclusions.map(i => i.value),
  exclusions: form.exclusions.map(i => i.value),
      doc_id: row_id
    };

    try {
      const res = await fetch(`${API_URL}/vendor/Form-inc/${row_id}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save');
     // alert(isEdit ? 'Updated successfully' : 'Saved successfully');
    } catch (err) {
      console.error('Submit error:', err.message);
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-lg-12" style={{ backgroundColor: '#69f33e' }}>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Inclusions & Exclusions Details</h3>

            <form onSubmit={handleSubmit}>
              {/* Inclusion Dropdown */}
              <div className="mb-3">
                <label><b>Inclusions</b></label>
                <Select
                  isMulti
                  options={inclusionOptions}
                  value={form.inclusions}
                  onChange={(selected) => setForm({ ...form, inclusions: selected })}
                />
              </div>

              {/* Exclusion Dropdown */}
              <div className="mb-3">
                <label><b>Exclusions</b></label>
                <Select
  isMulti
  options={exclusionOptions}
  value={form.exclusions}
  onChange={(selected) => setForm({ ...form, exclusions: selected })}
/>
              </div>

              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
