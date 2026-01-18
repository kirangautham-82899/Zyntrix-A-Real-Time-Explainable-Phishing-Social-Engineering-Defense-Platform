import { useState, useCallback } from 'react';
import Zyntrix from '../core/Zyntrix';
export const useZyntrix = () => {
  const [loading, setLoading] = useState(false);
  const scanUrl = useCallback(async url => {
    setLoading(true);
    const result = await Zyntrix.getClient().scanUrl(url);
    setLoading(false);
    return result;
  }, []);
  const scanMessage = useCallback(async text => {
    setLoading(true);
    const result = await Zyntrix.getClient().scanMessage(text);
    setLoading(false);
    return result;
  }, []);
  return {
    scanUrl,
    scanMessage,
    loading
  };
};
//# sourceMappingURL=useZyntrix.js.map