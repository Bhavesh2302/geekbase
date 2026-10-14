import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useToastStore } from '../store/toastStore';
import { DASHBOARD_QUERY_KEY } from './useDashboard';
import type {
  StudyPlan,
  CreateStudyPlanDto,
  UpdateStudyPlanDto,
} from '../types/studyPlan';

export interface GetStudyPlansParams {
  startDate?: string;
  endDate?: string;
}

export const STUDY_PLANS_QUERY_KEY = ['studyPlans'] as const;

export const getStudyPlansQueryKey = (params?: GetStudyPlansParams) => {
  return params && (params.startDate || params.endDate)
    ? (['studyPlans', params] as const)
    : (['studyPlans'] as const);
};

export const useStudyPlans = (params?: GetStudyPlansParams) => {
  return useQuery<StudyPlan[], Error>({
    queryKey: getStudyPlansQueryKey(params),
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.startDate) query.append('startDate', params.startDate);
      if (params?.endDate) query.append('endDate', params.endDate);
      const qs = query.toString();
      const url = qs ? `/study-plans?${qs}` : '/study-plans';

      const response = await api.get<{ plans: StudyPlan[] }>(url);
      return response.plans || [];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<StudyPlan, Error, CreateStudyPlanDto>({
    mutationFn: async (input: CreateStudyPlanDto) => {
      const response = await api.post<{ plan: StudyPlan }>('/study-plans', input);
      return response.plan;
    },
    onSuccess: (createdPlan) => {
      useToastStore
        .getState()
        .showToast('Study session scheduled successfully.', 'success');

      queryClient.invalidateQueries({ queryKey: STUDY_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      return createdPlan;
    },
    onError: (err: Error) => {
      useToastStore
        .getState()
        .showToast(err.message || 'Failed to schedule study session.', 'error');
    },
  });
};

export interface UpdateStudyPlanVariables {
  planId: string;
  data: UpdateStudyPlanDto;
}

export interface UpdateStudyPlanContext {
  previousQueries?: Array<[readonly unknown[], StudyPlan[] | undefined]>;
}

export const useUpdateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<
    StudyPlan,
    Error,
    UpdateStudyPlanVariables,
    UpdateStudyPlanContext
  >({
    mutationFn: async ({ planId, data }: UpdateStudyPlanVariables) => {
      const response = await api.patch<{ plan: StudyPlan }>(
        `/study-plans/${planId}`,
        data
      );
      return response.plan;
    },

    onMutate: async ({ planId, data }) => {
      await queryClient.cancelQueries({ queryKey: STUDY_PLANS_QUERY_KEY });

      const queries = queryClient.getQueriesData<StudyPlan[]>({
        queryKey: STUDY_PLANS_QUERY_KEY,
      });

      const previousQueries: Array<[readonly unknown[], StudyPlan[] | undefined]> = [];

      queries.forEach(([key, oldData]) => {
        previousQueries.push([key, oldData]);
        if (oldData) {
          const updated = oldData.map((plan) => {
            if (plan._id === planId) {
              return {
                ...plan,
                ...data,
                updatedAt: new Date().toISOString(),
              };
            }
            return plan;
          });
          queryClient.setQueryData(key, updated);
        }
      });

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      useToastStore
        .getState()
        .showToast(err.message || 'Failed to update study plan.', 'error');
    },

    onSuccess: (_updatedPlan, variables) => {
      const statusMsg = variables.data.status
        ? ` marked as ${variables.data.status}`
        : ' updated';
      useToastStore.getState().showToast(`Study plan${statusMsg}.`, 'success');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STUDY_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};

export interface DeleteStudyPlanVariables {
  planId: string;
}

export interface DeleteStudyPlanContext {
  previousQueries?: Array<[readonly unknown[], StudyPlan[] | undefined]>;
}

export const useDeleteStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { deletedId: string; message: string },
    Error,
    DeleteStudyPlanVariables,
    DeleteStudyPlanContext
  >({
    mutationFn: async ({ planId }: DeleteStudyPlanVariables) => {
      return api.delete<{ deletedId: string; message: string }>(
        `/study-plans/${planId}`
      );
    },

    onMutate: async ({ planId }) => {
      await queryClient.cancelQueries({ queryKey: STUDY_PLANS_QUERY_KEY });

      const queries = queryClient.getQueriesData<StudyPlan[]>({
        queryKey: STUDY_PLANS_QUERY_KEY,
      });

      const previousQueries: Array<[readonly unknown[], StudyPlan[] | undefined]> = [];

      queries.forEach(([key, oldData]) => {
        previousQueries.push([key, oldData]);
        if (oldData) {
          queryClient.setQueryData(
            key,
            oldData.filter((plan) => plan._id !== planId)
          );
        }
      });

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      useToastStore
        .getState()
        .showToast(err.message || 'Failed to delete study plan.', 'error');
    },

    onSuccess: () => {
      useToastStore
        .getState()
        .showToast('Study session deleted from calendar.', 'success');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STUDY_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};
