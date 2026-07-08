import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, Select, Divider, App as AntdApp, AutoComplete, Radio } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from './supabaseClient';
import axios from 'axios';
import tinycolor from 'tinycolor2';
import { THAILAND_PROVINCES, CAR_BRANDS, MODEL_CAR_TYPE_MAPPING, BASIC_COLORS, getValidColor } from './constants/carData';

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


const CarFormModal = ({ visible, onCancel, onSave, editingCar, cars = [] }) => {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isCompanyOwned, setIsCompanyOwned] = useState(true);
  const [owners, setOwners] = useState([]);
  const [colorSearchText, setColorSearchText] = useState('');

  // Watch fields
  const selectedBrand = Form.useWatch('brand', form);
  const selectedColor = Form.useWatch('color', form);

  // Compute dynamic brands from hardcoded + db
  const dbBrands = [...new Set(cars.map(c => c.brand).filter(Boolean))];
  const allBrands = [...new Set([...Object.keys(CAR_BRANDS), ...dbBrands])].sort();

  // Compute dynamic models from hardcoded + db for selectedBrand
  const hardcodedModels = selectedBrand && CAR_BRANDS[selectedBrand] ? CAR_BRANDS[selectedBrand] : [];
  const dbModelsForBrand = cars.filter(c => c.brand === selectedBrand).map(c => c.model).filter(Boolean);
  const allModels = [...new Set([...hardcodedModels, ...dbModelsForBrand])].sort();
  
  // Compute dynamic colors from hardcoded + db
  const dbColors = [...new Set(cars.map(c => c.color).filter(Boolean))];
  const allColors = [...new Set([...BASIC_COLORS, ...dbColors])].sort();
  
  // Create dropdown options that dynamically include whatever the user is typing
  let colorDisplayOptions = allColors.map(c => ({ value: c, isShade: false }));
  const currentText = colorSearchText || selectedColor; // Fallback to selectedColor if search is empty
  
  if (currentText) {
    // Intelligently find the color to generate shades for.
    // If what they typed isn't a valid color yet, find the first matching color from our list!
    let colorToShade = currentText;
    if (!tinycolor(getValidColor(colorToShade)).isValid()) {
      const partialMatch = allColors.find(c => c.toLowerCase().startsWith(currentText.toLowerCase()));
      if (partialMatch) {
        colorToShade = partialMatch;
      }
    }

    const validHex = getValidColor(colorToShade);
    const tc = tinycolor(validHex);
    
    // If it's a valid recognizable color, generate 5 shades!
    if (tc.isValid()) {
      const shades = [
        tc.clone().lighten(30).toHexString(), // Lighter 2
        tc.clone().lighten(15).toHexString(), // Lighter 1
        tc.clone().darken(15).toHexString(),  // Darker 1
        tc.clone().darken(30).toHexString(),  // Darker 2
      ];
      
      // Inject shades at the top (reversed so they end up in logical order)
      shades.reverse().forEach(shade => {
        if (!colorDisplayOptions.some(opt => opt.value.toLowerCase() === shade.toLowerCase())) {
          colorDisplayOptions.unshift({ value: shade, isShade: true });
        }
      });
    }

    // Always keep the exact text typed at the very top, if they typed something
    colorDisplayOptions = colorDisplayOptions.filter(opt => opt.value.toLowerCase() !== currentText.toLowerCase());
    colorDisplayOptions.unshift({ value: currentText, isShade: true });
    
    // If we used a partial match to generate shades, make sure that partial match color is also visible at the top!
    if (colorToShade !== currentText) {
      colorDisplayOptions = colorDisplayOptions.filter(opt => opt.value.toLowerCase() !== colorToShade.toLowerCase());
      // Insert it right after the current typed text (index 1)
      colorDisplayOptions.splice(1, 0, { value: colorToShade, isShade: true });
    }
  }

  // States for Quick Add Owner
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  const fetchOwners = async () => {
    try {
      const response = await axios.get(`${API_URL}/owners`);
      setOwners(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch owners");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchOwners();
      setColorSearchText(''); // Clear leftover typing state
    }
    if (visible && editingCar) {
      form.setFieldsValue({
        ...editingCar,
        isCompanyOwned: editingCar.isCompanyOwned
      });
      setImageUrls(editingCar.imageUrls || []);
      setIsCompanyOwned(editingCar.isCompanyOwned);
    } else if (visible && !editingCar) {
      form.resetFields();
      form.setFieldsValue({ isCompanyOwned: true });
      setImageUrls([]);
      setIsCompanyOwned(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingCar, form]);

  const handleUpload = async (info) => {
    const file = info.file;
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);

      const newUrl = data.publicUrl;
      setImageUrls(prev => [...prev, newUrl]);
      message.success('Image uploaded successfully');
    } catch (error) {
      message.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (urlToRemove) => {
    setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleAddOwner = async (e) => {
    e.preventDefault();
    if (!newOwnerName || !newOwnerPhone) {
      message.warning("Please provide name and phone for the new owner");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/owners`, {
        name: newOwnerName,
        phone: newOwnerPhone,
        email: newOwnerEmail || null
      });
      setOwners([...owners, response.data]);
      form.setFieldsValue({ ownerId: response.data.id });
      setNewOwnerName('');
      setNewOwnerPhone('');
      setNewOwnerEmail('');
      message.success("Owner added successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to add owner");
    }
  };

  const onFinish = (values) => {
    onSave({ ...values, imageUrls, isCompanyOwned });
  };

  return (
    <Modal
      title={editingCar ? "Edit Car" : "Add New Car"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Save"
      destroyOnHidden
      width={700}
      style={{ top: 20 }}
      styles={{ body: { maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: '10px' } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isCompanyOwned: true }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="registrationNumber"
            label="Registration Number"
            rules={[{ required: true, message: 'Please input the registration number!' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g. กข 1234" allowClear />
          </Form.Item>

          <Form.Item
            name="province"
            label="Province"
            rules={[{ required: true, message: 'Please select a province!' }]}
            style={{ flex: 1 }}
            initialValue="กรุงเทพมหานคร"
          >
            <Select
              showSearch
              allowClear
              placeholder="Select province"
              filterOption={(input, option) =>
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {THAILAND_PROVINCES.map(prov => (
                <Option key={prov} value={prov}>{prov}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Please input the car brand!' }]}
            style={{ flex: 1 }}
          >
            <AutoComplete
              allowClear
              options={allBrands.map(brand => ({ value: brand }))}
              placeholder="e.g. Toyota"
              onChange={() => form.setFieldsValue({ model: undefined })}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please input the car model!' }]}
            style={{ flex: 1 }}
          >
            <AutoComplete
              allowClear
              options={allModels.map(model => ({ value: model }))}
              placeholder={selectedBrand ? "e.g. Yaris" : "Select brand first"}
              disabled={!selectedBrand && !form.getFieldValue('brand')} // Disable if no text in brand
              onChange={(value) => {
                // If value is empty, don't auto-fill
                if (!value) return;

                // First try mapping (case-insensitive)
                const mappingKey = Object.keys(MODEL_CAR_TYPE_MAPPING).find(
                  k => k.toLowerCase() === value.toLowerCase().trim()
                );

                if (mappingKey) {
                  const mapping = MODEL_CAR_TYPE_MAPPING[mappingKey];
                  form.setFieldsValue({ carType: mapping.type, engineType: mapping.engine });
                } else if (selectedBrand) {
                  // If not in mapping, check DB (case-insensitive)
                  const dbCar = cars.find(c =>
                    c.brand && c.model &&
                    c.brand.toLowerCase() === selectedBrand.toLowerCase().trim() &&
                    c.model.toLowerCase() === value.toLowerCase().trim()
                  );
                  if (dbCar) {
                    form.setFieldsValue({ carType: dbCar.carType, engineType: dbCar.engineType, color: dbCar.color });
                  }
                }
              }}
              onSelect={(value) => {
                // Same logic for onSelect to ensure dropdown clicks work perfectly
                const mappingKey = Object.keys(MODEL_CAR_TYPE_MAPPING).find(
                  k => k.toLowerCase() === value.toLowerCase().trim()
                );
                if (mappingKey) {
                  const mapping = MODEL_CAR_TYPE_MAPPING[mappingKey];
                  form.setFieldsValue({ carType: mapping.type, engineType: mapping.engine });
                } else if (selectedBrand) {
                  const dbCar = cars.find(c =>
                    c.brand && c.model &&
                    c.brand.toLowerCase() === selectedBrand.toLowerCase().trim() &&
                    c.model.toLowerCase() === value.toLowerCase().trim()
                  );
                  if (dbCar) {
                    form.setFieldsValue({ carType: dbCar.carType, engineType: dbCar.engineType, color: dbCar.color });
                  }
                }
              }}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: 'Please input the car color!' }]}
            initialValue="White"
            style={{ flex: 1 }}
          >
            <AutoComplete
              allowClear
              options={colorDisplayOptions.map(opt => ({ 
                value: opt.value,
                isShade: opt.isShade,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getValidColor(opt.value), border: '1px solid #d9d9d9' }} />
                    {opt.value}
                  </div>
                )
              }))}
              placeholder="e.g. White"
              defaultActiveFirstOption={true}
              onSearch={setColorSearchText}
              filterOption={(inputValue, option) =>
                option.isShade || option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              <Input 
                prefix={
                  <div style={{ 
                    width: '14px', height: '14px', borderRadius: '50%', 
                    backgroundColor: getValidColor(selectedColor), 
                    border: '1px solid #d9d9d9',
                    marginRight: '4px'
                  }} />
                } 
                allowClear
              />
            </AutoComplete>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="carType"
            label="Car Type"
            rules={[{ required: true, message: 'Please select a car type!' }]}
            style={{ flex: 1 }}
          >
            <Select allowClear placeholder="Select car type">
              <Option value="mini">Mini</Option>
              <Option value="sedan">Sedan</Option>
              <Option value="hatchback">Hatchback</Option>
              <Option value="suv">SUV</Option>
              <Option value="van">Van</Option>
              <Option value="pick-up">Pick-up</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="engineType"
            label="Engine Type"
            rules={[{ required: true, message: 'Please select engine type!' }]}
            style={{ flex: 1 }}
          >
            <Select allowClear placeholder="Select engine">
              <Option value="fuel"><span style={{ marginRight: '8px' }}>⛽</span>Fuel</Option>
              <Option value="ev"><span style={{ marginRight: '8px' }}>⚡</span>EV</Option>
              <Option value="hybrid"><span style={{ marginRight: '8px' }}>♻️</span>Hybrid</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="transmission"
            label="Transmission"
            rules={[{ required: true, message: 'Please select transmission type!' }]}
            style={{ flex: 1 }}
          >
            <Select allowClear placeholder="Select transmission">
              <Option value="automatic">Automatic</Option>
              <Option value="manual">Manual</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: 'Required!' }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="seat"
            label="Seats"
            rules={[{ required: true, message: 'Required!' }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="pricePerDay"
            label="Price/Day (฿)"
            rules={[{ required: true, message: 'Required!' }]}
            style={{ flex: 1 }}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        {/* Ownership Section */}
        <div style={{ background: '#f5f7fa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Form.Item
            name="isCompanyOwned"
            label="Car Ownership"
          >
            <Radio.Group 
              value={isCompanyOwned} 
              onChange={(e) => setIsCompanyOwned(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value={true}>🏢 Haupcar Asset</Radio.Button>
              <Radio.Button value={false}>🤝 Partner / Private Owner</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {!isCompanyOwned && (
            <Form.Item
              name="ownerId"
              label="Select Car Owner (Partner)"
              rules={[{ required: !isCompanyOwned, message: 'Please select an owner!' }]}
            >
              <Select
                allowClear
                placeholder="Select an owner"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px 4px' }}>
                      <Input
                        placeholder="Owner Name (Company or Person)"
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        allowClear
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Input
                          placeholder="Phone Number"
                          value={newOwnerPhone}
                          onChange={(e) => setNewOwnerPhone(e.target.value.replace(/\D/g, ''))}
                          allowClear
                          style={{ flex: 1 }}
                        />
                        <Input
                          placeholder="Email (Optional)"
                          value={newOwnerEmail}
                          onChange={(e) => setNewOwnerEmail(e.target.value)}
                          allowClear
                          style={{ flex: 1 }}
                        />
                      </div>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOwner} block>
                        Add New Partner
                      </Button>
                    </div>
                  </>
                )}
              >
                {owners.map(owner => (
                  <Option key={owner.id} value={owner.id}>{owner.name} ({owner.phone})</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </div>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} placeholder="Any additional information..." allowClear />
        </Form.Item>

        <Form.Item label="Car Images">
          <Upload
            name="file"
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
            multiple={true}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Click to Upload Images
            </Button>
          </Upload>

          {imageUrls.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {imageUrls.map((url, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={url} alt={`car-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d9d9d9' }} />
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ position: 'absolute', top: '-5px', right: '-5px', borderRadius: '50%' }}
                    onClick={() => removeImage(url)}
                  />
                </div>
              ))}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarFormModal;
