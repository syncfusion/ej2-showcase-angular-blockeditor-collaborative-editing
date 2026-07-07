import * as Y from 'yjs';

export interface CollaborationAdapter {
  yRuntime: typeof Y;
  yXmlFragment: Y.XmlFragment;
}

export interface AwarenessState {
  user?: any;
  cursor?: any;
}
