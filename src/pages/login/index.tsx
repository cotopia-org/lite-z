import LoginWrapper from "./components/Wrapper";
import { StepValues } from "@/components/shared";
import EnterMobileNumber from "./credential/enter-mobile";
import EnterPassword from "./credential/enter-password";
import CredentialWrapper from "./credential/wrapper";
import useQuery from "@/hooks/query-params";

type Props = {};

const LoginPage = (props: Props) => {
  const { query } = useQuery();
  const mobile = query["mobile"] ?? "";

  return (
    <LoginWrapper>
      <StepValues initValues={{ mobile }}>
        {({ nextStep, prevStep, values, step, changeKey }) => {
          let content = (
            <EnterMobileNumber
              defaultMobile={values?.mobile}
              nextStep={nextStep}
              changeKey={changeKey}
            />
          );
          if (step === 1) {
            content = (
              <EnterPassword
                onEditPhone={prevStep}
                mobile={values?.mobile ?? ""}
              />
            );
          }
          return <CredentialWrapper>{content}</CredentialWrapper>;
        }}
      </StepValues>
    </LoginWrapper>
  );
};

export default LoginPage;
