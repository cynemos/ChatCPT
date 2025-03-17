import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  return json({ analysis: "PDF analysis is not implemented in this environment due to the lack of PDF processing libraries." }, { status: 501 });
};
