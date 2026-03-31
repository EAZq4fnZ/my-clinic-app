import { createFileRoute, useNavigate } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';
import { createMutation, useQueryClient } from '@tanstack/solid-query';

// ★ エイリアスを使用してパスを解決
import EraDatePicker from '@ui/EraDatePicker';
import { createPatient } from '@features/patients/services/patientService';

// ★ 型エラー「PatientInsertがありません」を解決する確実な方法
import type { Database } from '@/types/database';
type PatientInsert = Database['public']['Tables']['patients']['Insert'];

export const Route = createFileRoute('/patient-form')({
  component: PatientFormPage,
});

function PatientFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 状態管理
  const [firstName, setFirstName] = createSignal('');
  const [lastName, setLastName] = createSignal('');
  const [birthDate, setBirthDate] = createSignal('');

  // Mutation設定
  const mutation = createMutation(() => ({
    mutationFn: (newPatient: PatientInsert) => createPatient(newPatient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      navigate({ to: '/patients' });
    },
  }));

  // ... (以下、JSX部分)
}