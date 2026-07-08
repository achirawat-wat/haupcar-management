import React from 'react';
import { Table, Button, Space, Image, Popconfirm, Tag, Tooltip, Empty, Skeleton, Slider } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getValidColor } from './constants/carData';

const CarList = ({ cars, loading, onEdit, onDelete, onChange }) => {
  const uniqueBrands = [...new Set(cars.map(c => c.brand).filter(Boolean))].sort();
  const uniqueTypes = [...new Set(cars.map(c => c.carType).filter(Boolean))].sort();
  const uniqueEngines = [...new Set(cars.map(c => c.engineType).filter(Boolean))].sort();
  const uniqueTransmissions = [...new Set(cars.map(c => c.transmission).filter(Boolean))].sort();
  const uniqueYears = [...new Set(cars.map(c => c.year).filter(Boolean))].sort((a,b) => b - a);
  const uniqueSeats = [...new Set(cars.map(c => c.seat).filter(Boolean))].sort((a,b) => a - b);
  const uniqueOwners = [...new Set(cars.map(c => c.isCompanyOwned ? 'Haupcar' : (c.owner?.name || 'Partner')))].sort();

  const prices = cars.map(c => c.pricePerDay || 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000;
  
  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrls',
      key: 'imageUrls',
      render: (urls) => (
        urls && urls.length > 0 ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Image.PreviewGroup>
              <Image width={80} style={{ borderRadius: '4px', objectFit: 'cover', height: '60px' }} src={urls[0]} alt="car" />
              {urls.slice(1).map((url, idx) => (
                <Image key={idx} src={url} style={{ display: 'none' }} />
              ))}
            </Image.PreviewGroup>
            {urls.length > 1 && (
              <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#0048b3', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', pointerEvents: 'none' }}>
                +{urls.length - 1}
              </span>
            )}
          </div>
        ) : <span style={{ color: '#ccc' }}>No Image</span>
      ),
    },
    {
      title: 'Registration No.',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      render: (text, record) => <strong>{text} {record.province}</strong>,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      filters: uniqueBrands.map(b => ({ text: b, value: b })),
      onFilter: (value, record) => record.brand === value,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip title={record.color || 'No color'}>
            <div 
              style={{ 
                width: '14px', 
                height: '14px', 
                borderRadius: '50%', 
                backgroundColor: getValidColor(record.color),
                border: '1px solid #e0e0e0',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
              }} 
            />
          </Tooltip>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Type / Engine',
      key: 'typeEngine',
      filters: [
        { text: 'Type', value: 'Type', children: uniqueTypes.map(t => ({ text: t.toUpperCase(), value: `type:${t}` })) },
        { text: 'Engine', value: 'Engine', children: uniqueEngines.map(e => ({ text: e.toUpperCase(), value: `engine:${e}` })) }
      ],
      onFilter: (value, record) => {
        if (typeof value === 'string' && value.startsWith('type:')) return record.carType === value.split(':')[1];
        if (typeof value === 'string' && value.startsWith('engine:')) return record.engineType === value.split(':')[1];
        return false;
      },
      render: (_, record) => {
        let engineTag;
        if (record.engineType === 'ev') {
          engineTag = <Tooltip title="EV"><Tag color="green" style={{ borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, marginTop: '4px', fontSize: '12px' }}>⚡</Tag></Tooltip>;
        } else if (record.engineType === 'hybrid') {
          engineTag = <Tooltip title="Hybrid"><Tag color="blue" style={{ borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, marginTop: '4px', fontSize: '12px' }}>♻️</Tag></Tooltip>;
        } else {
          engineTag = <Tooltip title="Fuel"><Tag color="default" style={{ borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, marginTop: '4px', fontSize: '12px' }}>⛽</Tag></Tooltip>;
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {engineTag}
            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{record.carType || '-'}</span>
          </div>
        );
      }
    },
    {
      title: 'Trans.',
      dataIndex: 'transmission',
      key: 'transmission',
      filters: uniqueTransmissions.map(t => ({ text: t === 'automatic' ? 'Auto' : 'Manual', value: t })),
      onFilter: (value, record) => record.transmission === value,
      render: (text) => (
        <span style={{ 
          background: text === 'automatic' ? '#e6f4ff' : '#f6ffed', 
          color: text === 'automatic' ? '#1677ff' : '#52c41a',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {text === 'automatic' ? 'Auto' : 'Manual'}
        </span>
      )
    },
    {
      title: 'Year/Seat',
      key: 'yearseat',
      filters: [
        { text: 'Year', value: 'Year', children: uniqueYears.map(y => ({ text: y.toString(), value: `year:${y}` })) },
        { text: 'Seats', value: 'Seats', children: uniqueSeats.map(s => ({ text: `${s} Seats`, value: `seat:${s}` })) }
      ],
      onFilter: (value, record) => {
        if (typeof value === 'string' && value.startsWith('year:')) return record.year === parseInt(value.split(':')[1]);
        if (typeof value === 'string' && value.startsWith('seat:')) return record.seat === parseInt(value.split(':')[1]);
        return false;
      },
      render: (_, record) => <span>{record.year} / {record.seat} seats</span>
    },
    {
      title: 'Price (฿/day)',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 16, width: 250 }} onKeyDown={(e) => e.stopPropagation()}>
          <div style={{ marginBottom: 8, textAlign: 'center' }}>
            <span>Range: ฿{selectedKeys[0]?.[0] || minPrice} - ฿{selectedKeys[0]?.[1] || maxPrice}</span>
          </div>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            step={100}
            value={selectedKeys[0] || [minPrice, maxPrice]}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
            style={{ marginBottom: 16 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) clearFilters();
                setSelectedKeys([]);
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length !== 2) return true;
        return record.pricePerDay >= value[0] && record.pricePerDay <= value[1];
      },
      render: (price) => <strong>{price?.toLocaleString()}</strong>
    },
    {
      title: 'Owner',
      key: 'owner',
      filters: uniqueOwners.map(o => ({ text: o, value: o })),
      onFilter: (value, record) => {
        const ownerName = record.isCompanyOwned ? 'Haupcar' : (record.owner?.name || 'Partner');
        return ownerName === value;
      },
      render: (_, record) => (
        record.isCompanyOwned 
          ? <span style={{ color: '#0048b3', fontWeight: 'bold' }}>Haupcar</span>
          : <span style={{ color: '#52c41a' }}>{record.owner?.name || 'Partner'}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the car"
            description="Are you sure to delete this car?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Helper for Engine Tag (used in mobile too)
  const getEngineTag = (engineType) => {
    if (engineType === 'ev') return <Tag color="green" style={{ borderRadius: '4px', margin: 0 }}>⚡ EV</Tag>;
    if (engineType === 'hybrid') return <Tag color="blue" style={{ borderRadius: '4px', margin: 0 }}>♻️ Hybrid</Tag>;
    return <Tag color="default" style={{ borderRadius: '4px', margin: 0 }}>⛽ Fuel</Tag>;
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table 
          columns={columns} 
          dataSource={cars} 
          rowKey="id"
          loading={loading}
          onChange={onChange}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_DEFAULT} 
                description={
                  <span className="text-on-surface-variant font-body-md">
                    No cars found.<br/> Try adjusting your search filters or add a new car.
                  </span>
                } 
              />
            )
          }}
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-surface-lowest border border-outline-variant p-4 rounded-xl">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))
        ) : cars.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_DEFAULT} 
            description={<span className="text-on-surface-variant">No cars found.</span>} 
          />
        ) : (
          cars.map(car => (
            <div key={car.id} className="bg-surface-lowest border border-outline-variant p-4 rounded-xl shadow-sm flex flex-col gap-3">
              <div className="flex gap-4">
                {/* Image */}
                <div className="shrink-0 w-[100px] h-[75px] rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
                  {car.imageUrls && car.imageUrls.length > 0 ? (
                    <img src={car.imageUrls[0]} alt="car" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-outline text-xs">No img</span>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-on-surface truncate pr-2">{car.brand} {car.model}</h4>
                    <Tooltip title={car.color || 'No color'}>
                      <div className="w-4 h-4 rounded-full shrink-0 border border-outline-variant" style={{ backgroundColor: getValidColor(car.color) }} />
                    </Tooltip>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-1">{car.registrationNumber} {car.province}</p>
                  <p className="text-xs text-on-surface-variant">{car.year} • {car.seat} Seats • {car.transmission === 'automatic' ? 'Auto' : 'Manual'}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded-lg border border-outline-variant">
                <div className="flex items-center gap-2">
                  {getEngineTag(car.engineType)}
                  <span className="text-xs capitalize px-2 py-1 bg-surface-container rounded-md text-on-surface-variant">{car.carType}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">฿{car.pricePerDay?.toLocaleString()}</span><span className="text-xs text-on-surface-variant">/day</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 border-t border-outline-variant pt-3">
                <div className="text-xs">
                  {car.isCompanyOwned 
                    ? <span className="font-bold text-[#0048b3]">Haupcar</span>
                    : <span className="text-[#52c41a]">{car.owner?.name || 'Partner'}</span>}
                </div>
                <Space size="middle">
                  <Button size="small" type="text" icon={<EditOutlined />} onClick={() => onEdit(car)}>Edit</Button>
                  <Popconfirm title="Delete?" onConfirm={() => onDelete(car.id)} okText="Yes" cancelText="No">
                    <Button size="small" type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CarList;
