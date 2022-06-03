import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';

import { Button } from 'antd';
import "./header.scss"
import React, { useRef, useState, forwardRef,useImperativeHandle, } from 'react';

const defaultData = [
  {
    id: '624748504',
    header_head:'Content-Type',
    header_body:'text/plain',
  },
];

let i = 0;

const Addable_headers =forwardRef( (props, parentRef) => {
  const [editableKeys, setEditableRowKeys] = useState(() => []);
  const position='bottom';
  const formRef = useRef();
  const editorFormRef = useRef();
  useImperativeHandle(parentRef, () => {
    return {
      getHeaders() {
        return editorFormRef.current?.getRowsData?.();
      }
    }
  })
  const columns = [
    {
      title: '参数名',
      dataIndex: 'header_head',
    },
    {
      title: '参数值',
      dataIndex: 'header_body',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('table');
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <ProForm
      formRef={formRef}
      initialValues={{
        table: defaultData,
      }}
      validateTrigger="onBlur"
    >
      <EditableProTable
        rowKey="id"
        editableFormRef={editorFormRef}
        maxLength={5}
        name="table"
        recordCreatorProps={
          position !== 'hidden'
            ? {
                position: position,
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </ProForm>
  );
});

export default Addable_headers;