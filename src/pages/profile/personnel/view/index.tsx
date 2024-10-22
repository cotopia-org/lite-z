import NormalPageHolder from "@/components/containers/normal-page-holder";
import NotFound from "@/components/partials/not-found";
import { useApi } from "@/hooks/use-api";
import { FetchDataType } from "@/services/axios";
import { PersonType } from "@/types/person";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Details from "./details";
import CircularLoading from "@/components/partials/circular-loading";
import List from "./list";

export default function SingleViewPersonnelPage() {
  const { id } = useParams();

  const { data, isLoading } = useApi<FetchDataType<PersonType>>(
    `/person/${id}`
  );

  const person = data !== undefined ? data : undefined;

  console.log("person", person);

  let content = null;

  if (person !== undefined)
    content = (
      <div className='flex flex-col gap-y-8'>
        <Details person={person} />
        <List person={person} />
      </div>
    );

  if (!person) content = <NotFound />;

  if (isLoading || data === undefined) content = <CircularLoading />;

  return (
    <NormalPageHolder title='جزئیات' hasBack>
      {content}
    </NormalPageHolder>
  );
}
