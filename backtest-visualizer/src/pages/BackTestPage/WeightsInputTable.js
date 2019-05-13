import { Table, Button, Form, InputNumber, Input } from "antd";
import React from "react";
import { assetCodeList } from "utils/data";
import { getFloatRandWeights } from "utils/utils";
import RebalanceSelect from "./RebalanceSelect";
import StrategySelect from "./StrategySelect";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(
                    <Input
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                      onBlur={this.save}
                    />
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 5 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const { columns, dataSource } = props;
    this.columns = [
      ...columns,
      {
        title: "Rebalancing",
        dataIndex: "rebalancing",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <RebalanceSelect
                handleChange={type =>
                  this.selectRebalanceType(record.key, type)
                }
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "Strategy",
        dataIndex: "strategy",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <StrategySelect
                handleChange={type => this.selectStrategyType(record.key, type)}
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <button onClick={() => this.handleRun(record.key)}>Run</button>
              <button onClick={() => this.handleDelete(record.key)}>
                Delete
              </button>
            </React.Fragment>
          ) : null
      }
    ];

    this.state = dataSource;
  }

  selectRebalanceType = (key, type) => {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.map(data =>
        key === data.key ? { ...data, rebalanceType: type } : data
      )
    });
  };

  selectStrategyType = (key, type) => {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.map(data =>
        key === data.key ? { ...data, strategyType: type } : data
      )
    });
  };

  handleRun = key => {
    const dataSource = [...this.state.dataSource];
    const data = dataSource.filter(item => item.key === key);

    const weightsList = [];
    assetCodeList.map(code => {
      weightsList.push(data[0][code]);
    });
    weightsList.push(0);

    const { name, rebalanceType, strategyType } = data[0];

    this.props.runHandler(weightsList, name, rebalanceType, strategyType);
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;

    const defaultData = {
      "069500": 100,
      "232080": 0,
      "143850": 0,
      "195930": 0,
      "238720": 0,
      "192090": 0,
      "148070": 0,
      "136340": 0,
      "182490": 0,
      "132030": 0,
      "130680": 0,
      "114800": 0,
      "138230": 0,
      "139660": 0,
      "130730": 0
    };

    const length = dataSource.length;

    const lastData =
      length >= 1 ? dataSource[dataSource.length - 1] : defaultData;

    const newData = {
      ...lastData,
      key: count,
      name: `Port #${count + 1}`,
      rebalanceType: "none",
      strategyType: "none"
    };

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleRandomAdd = () => {
    const { count, dataSource } = this.state;

    let randomWeights = getFloatRandWeights(15, 2);

    const codeList = [
      "069500",
      "232080",
      "143850",
      "195930",
      "238720",
      "192090",
      "148070",
      "136340",
      "182490",
      "132030",
      "130680",
      "114800",
      "138230",
      "139660",
      "130730"
    ];

    const weightsData = {};
    codeList.forEach((code, index) => {
      weightsData[code] = randomWeights[index];
    });

    const newData = {
      ...weightsData,
      key: count,
      name: `Port #${count + 1}`,
      rebalanceType: "none",
      strategyType: "none"
    };

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <Button
          onClick={this.handleRandomAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a random row
        </Button>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
          size="small"
        />
      </div>
    );
  }
}

export default EditableTable;
