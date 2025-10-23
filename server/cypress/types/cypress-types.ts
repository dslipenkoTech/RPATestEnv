export interface Test {
  name: string;
  pages: (number | [number, string, { skip?: boolean; isolate?: boolean; tags?: string[] }])[];
  skip?: boolean;
  only?: boolean;
  tags?: string[];
}

export interface ticketTest {
  name: string;
  skip?: boolean;
  tags?: string[];
  pages: (number | [number, string, () => void, { skip?: boolean; isolate?: boolean; tags?: string[] }])[];
}
