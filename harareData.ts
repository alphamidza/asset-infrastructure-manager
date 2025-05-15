// Node data type definition
export interface Node {
  id: string;
  p_name: string;
  start_node_name: string;
  end_node_name: string;
  node_id: string;
  elevation: number;
  betweennes: number;
  node_degre: number;
  eccentrici: number;
  start_latitude: number;
  start_longitude: number;
  pressure: number;
  head: number;
  demand: number;
  end_latitude: number;
  end_longitude: number;
  elevation_y: number;
  length: number;
  status: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

// Pipe data type definition
export interface Pipe {
  line_id: string;
  start_node: string;
  end_node_n: string;
  diameter: number;
  roughness: number;
  length: number;
  status: string;
  velocity: number;
  flow_rate: number;
  geometry: {
    type: string;
    coordinates: [[[number, number]]];
  };
}

export const nodeData: Node[] = (window as any).json_harare_nodes2_2.features.map((feature: any) => ({
  id: feature.properties.node_id,
  p_name: feature.properties.p_name,
  start_node_name: feature.properties.start_node_name,
  end_node_name: feature.properties.end_node_name,
  node_id: feature.properties.node_id,
  elevation: feature.properties.elevation,
  betweennes: feature.properties.betweennes,
  node_degre: feature.properties.node_degre,
  eccentrici: feature.properties.eccentrici,
  start_latitude: feature.properties.start_latitude,
  start_longitude: feature.properties.start_longitude,
  pressure: feature.properties.pressure,
  head: feature.properties.head,
  demand: feature.properties.demand,
  end_latitude: feature.properties.end_latitude,
  end_longitude: feature.properties.end_longitude,
  elevation_y: feature.properties.elevation_y,
  length: feature.properties.length,
  status: feature.properties.Status?.toLowerCase() || 'unknown',
  geometry: feature.geometry
}));

export const pipeData: Pipe[] = (window as any).json_harare_pipes_1.features.map((feature: any) => ({
  line_id: feature.properties.line_id,
  start_node: feature.properties.start_node,
  end_node_n: feature.properties.end_node_n,
  diameter: feature.properties.diameter,
  roughness: feature.properties.roughness,
  length: feature.properties.length,
  status: feature.properties.Status?.toLowerCase() || 'unknown',
  velocity: feature.properties.Velocity,
  flow_rate: feature.properties.flow_rate,
  geometry: feature.geometry
}));

// Calculate system metrics
export const calculateMetrics = () => {
  // Count nodes by status
  const nodeStatusCounts = {
    normal: nodeData.filter(node => node.status === 'normal').length,
    faulty: nodeData.filter(node => node.status === 'faulty').length,
    total: nodeData.length
  };

  // Count pipes by status
  const pipeStatusCounts = {
    normal: pipeData.filter(pipe => pipe.status === 'normal').length,
    faulty: pipeData.filter(pipe => pipe.status === 'faulty').length,
    total: pipeData.length
  };

  // Calculate average pressure
  const avgPressure = nodeData.reduce((sum, node) => sum + node.pressure, 0) / nodeData.length;

  // Calculate average flow rate
  const avgFlowRate = pipeData.reduce((sum, pipe) => sum + pipe.flow_rate, 0) / pipeData.length;

  // Calculate total demand
  const totalDemand = nodeData.reduce((sum, node) => sum + node.demand, 0);

  // Calculate network health percentage
  const networkHealth = 
    (((nodeStatusCounts.normal / nodeStatusCounts.total) + 
      (pipeStatusCounts.normal / pipeStatusCounts.total)) / 2) * 100;

  // Calculate high priority issues (nodes or pipes with faulty status and high pressure or flow rate)
  const highPriorityNodes = nodeData.filter(node => 
    node.status === 'faulty' && node.pressure > 30
  );

  const highPriorityPipes = pipeData.filter(pipe => 
    pipe.status === 'faulty' && pipe.flow_rate > 1.5
  );

  return {
    nodeStatusCounts,
    pipeStatusCounts,
    avgPressure,
    avgFlowRate,
    totalDemand,
    networkHealth,
    highPriorityIssues: highPriorityNodes.length + highPriorityPipes.length,
    highPriorityNodes,
    highPriorityPipes
  };
};

// Get all faulty assets for reporting
export const getFaultyAssets = () => {
  const faultyNodes = nodeData.filter(node => node.status === 'faulty');
  const faultyPipes = pipeData.filter(pipe => pipe.status === 'faulty');
  
  return { faultyNodes, faultyPipes };
};