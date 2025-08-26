import PreviewPage from '@/pages/preview';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/preview')({
  component: PreviewPage,
});
