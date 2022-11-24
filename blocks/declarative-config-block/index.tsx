import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box } from "@primer/react";
import * as yaml from "js-yaml";
import { Fragment } from "react";
import "./index.css";

export default function (props: FileBlockProps) {
  const { content } = props;

  const config: any = yaml.load(content);
  const j = JSON.stringify(config, null, 2);

  return (
    <Box p={4}>
      <details>
        <summary>See raw configuration</summary>
        <pre>{j}</pre>
      </details>
      <h1>Kong Configuration</h1>
      {config.services.map((s: any) => renderService(s, config, props))}
    </Box>
  );
}

function renderService(service: any, config: any, props: FileBlockProps) {
  return (
    <Box borderColor="border.default" borderWidth={1} borderStyle="solid" p={3}>
      <h2 style={{ marginBlockStart: 0 }}>Service: {service.name}</h2>
      <h3>Routes</h3>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gridGap={3}>

        {
          service.routes.map((route: any) => {
            return (
              <Box borderColor="border.default" borderWidth={1} borderStyle="solid" p={3}>
                Name: {route.name}<br />
                Paths: {route.paths && route.paths.map(multipleItems)}<br />
                Protocols: {route.protocols && route.protocols.map(multipleItems)}<br />
                Actions: <span style={{ cursor: "pointer" }} onClick={() => deleteRoute(service, route, config, props)}>❌</span>
              </Box>)
          })
        }
      </Box>


    </Box >
  )
}

function multipleItems(item: any) {
  return (<Fragment>
    {item},
  </Fragment>)
}

async function deleteRoute(service: any, route: any, config: any, props: FileBlockProps) {
  console.log(arguments);
  for (let s of config.services) {
    if (s.name == service.name) {
      for (let k in s.routes) {
        const r = s.routes[k];
        if (r.name == route.name) {
          delete s.routes[k];
          s.routes = s.routes.filter((r: any) => r);
          await props.onUpdateContent(yaml.dump(config));
          return false;
        }
      }
    }
  }
}