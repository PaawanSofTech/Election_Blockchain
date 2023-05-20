import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Select } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

const { Option } = Select;

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("");

  return (
    <div>
      <div>
        <div style={{ margin: 32 }}>
          <h1>Ballot Num of Candidates</h1>
          <h3>Party A = 1</h3>
          <h3>Party B = 2</h3>
          <h3>Party C = 3</h3>
          <h3>Party D = 4</h3>
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Enter the Ballot number:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Select
            onChange={value => {
              setNewPurpose(value);
            }}
            style={{ width: "100%" }}
          >
            <Option value="1">Party A</Option>
            <Option value="2">Party B</Option>
            <Option value="3">Party C</Option>
            <Option value="4">Party D</Option>
          </Select>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Vote!
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />        
      </div>

      {/* Display a list of events */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  );
}
