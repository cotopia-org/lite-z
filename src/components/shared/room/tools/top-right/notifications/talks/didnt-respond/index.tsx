import CotopiaPrompt from '@/components/shared-ui/c-prompt';

export default function TalkDidntRespondBox() {
  return (
    <>
      <CotopiaPrompt
        isPortal
        open={true}
        onSubmit={() => {}}
        onClose={() => {}}
        title="You didn’t respond!"
        description="You became inactive because you didn’t respond to an invitation. Are you there?"
        dialogContentClassName="!pt-6"
      />
    </>
  );
}
