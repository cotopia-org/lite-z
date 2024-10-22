import { useLocation, useNavigate } from "react-router-dom";
import Filters, { FitlersProps } from ".";
import useQuery from "@/hooks/query-params";
import { urlWithQueryParams } from "@/lib/utils";

type Props = FitlersProps;
export default function FilterWithQueries({ ...rest }: Props) {
  const location = useLocation();
  const { query } = useQuery();
  const navigate = useNavigate();

  const handleSearch = (values: { [key: string]: any }) => {
    navigate(urlWithQueryParams(location.pathname, { ...query, ...values }));
  };

  return <Filters onSearch={handleSearch} {...rest} />;
}
