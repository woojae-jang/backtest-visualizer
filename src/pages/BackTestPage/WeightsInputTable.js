import { Table, Button, Form, Input } from "antd";
import React from "react";
import { assetCodeList } from "utils/data";
import RebalanceSelect from "./RebalanceSelect";
import StrategySelect from "./StrategySelect";
import StrategyArgSelect from "./StrategyArgSelect";
import AssetSelect from "./AssetSelect";
import BatchSelect from "./BatchSelect";

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
    const selectColumn = [
      {
        title: "Rebalancing",
        dataIndex: "rebalancing",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <RebalanceSelect
                handleChange={type =>
                  this.selectHandler("rebalanceType", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].rebalanceType
                    : "none"
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
                handleChange={type =>
                  this.selectHandler("strategyType", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].strategyType
                    : "none"
                }
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "Arg1",
        dataIndex: "strategyArg1",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <StrategyArgSelect
                handleChange={type =>
                  this.selectHandler("strategyArg1", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].strategyArg1
                    : "none"
                }
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "Arg2",
        dataIndex: "strategyArg2",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <StrategyArgSelect
                handleChange={type =>
                  this.selectHandler("strategyArg2", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].strategyArg2
                    : "none"
                }
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "Arg3",
        dataIndex: "strategyArg3",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <StrategyArgSelect
                handleChange={type =>
                  this.selectHandler("strategyArg3", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].strategyArg3
                    : "none"
                }
              />
            </React.Fragment>
          ) : null
      },
      {
        title: "Asset",
        dataIndex: "selectedAsset",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <React.Fragment>
              <AssetSelect
                handleChange={type =>
                  this.selectHandler("selectedAsset", record.key, type)
                }
                preValue={
                  this.state.dataSource.filter(
                    data => data.key === record.key
                  )[0]
                    ? this.state.dataSource.filter(
                        data => data.key === record.key
                      )[0].selectedAsset
                    : "none"
                }
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

    this.columns = columns;
    this.columns.splice(1, 0, ...selectColumn);

    this.state = dataSource;
  }

  selectHandler = (selectTarget, key, type) => {
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.map(data =>
        key === data.key ? { ...data, [selectTarget]: type } : data
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

    const {
      name,
      rebalanceType,
      strategyType,
      strategyArg1,
      strategyArg2,
      strategyArg3,
      selectedAsset
    } = data[0];

    this.props.runHandler(
      weightsList,
      name,
      rebalanceType,
      strategyType,
      strategyArg1,
      strategyArg2,
      strategyArg3,
      selectedAsset
    );
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
      "130730": 0,
      WORLD_STOCK: 0,
      rebalanceType: "none",
      strategyType: "none",
      strategyArg1: "none",
      strategyArg2: "none",
      strategyArg3: "none",
      selectedAsset: "none"
    };

    const length = dataSource.length;

    const lastData =
      length >= 1 ? dataSource[dataSource.length - 1] : defaultData;

    const newData = {
      ...lastData,
      key: count,
      name: `Port #${count + 1}`
    };

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleAddPortfolio = type => {
    const { count, dataSource } = this.state;

    const newPortfolio = {
      key: count,
      name: "",
      "069500": 0,
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
      "130730": 0,
      WORLD_STOCK: 0,
      rebalanceType: "none",
      strategyType: "none",
      strategyArg1: "none",
      strategyArg2: "none",
      strategyArg3: "none",
      selectedAsset: "none"
    };

    if (type === "Permanent Portfolio") {
      newPortfolio.name = "Permanent Portfolio";
      newPortfolio["143850"] = 25;
      newPortfolio["182490"] = 25;
      newPortfolio["132030"] = 25;
      newPortfolio["130730"] = 25;
      newPortfolio.rebalanceType = "monthly";
    } else if (type === "50:50") {
      newPortfolio.name = "50:50";
      newPortfolio["143850"] = 50;
      newPortfolio["182490"] = 50;
      newPortfolio.rebalanceType = "monthly";
    } else if (type === "Dual Momentum") {
      newPortfolio.name = "Dual Momentum";
      newPortfolio.rebalanceType = "weekly";
      newPortfolio.strategyType = "momentum13";
      newPortfolio.strategyArg1 = "80";
      newPortfolio.strategyArg2 = "2";
    } else {
      console.log(type);
      throw "invalid portfolio type";
    }

    this.setState({
      dataSource: [...dataSource, newPortfolio],
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
    const { dataSource } = this.props.dataSource;
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
          onClick={() => this.handleAddPortfolio("Permanent Portfolio")}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add Permanent Portfolio
        </Button>
        <Button
          onClick={() => this.handleAddPortfolio("50:50")}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add 50:50 Portfolio
        </Button>
        <Button
          onClick={() => this.handleAddPortfolio("Dual Momentum")}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Dual Momentum
        </Button>
        <br />
        <BatchSelect batchSelection={this.props.batchSelection} />
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

  componentDidUpdate() {
    const rootComp = this.props.rootComp;
    const { dataSource, count } = this.state;

    const preState = rootComp.state.dataSource;
    const newState = this.state;

    const didChange = JSON.stringify(preState) !== JSON.stringify(newState);

    if (didChange) {
      rootComp.setState({
        dataSource: {
          dataSource,
          count
        }
      });
    }
  }
}

export default EditableTable;
