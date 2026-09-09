import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getData, saveData } from '../data/storage';

type Complaint = {
  id: string;
  text: string;
  date: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
};

const STORAGE_KEY = 'complaints';
const ROLE_KEY = 'userRole';

const initialComplaints: Complaint[] = [
  {
    id: 'CMP-001',
    text: 'Water leakage at Block A',
    date: '08 Sep 2026',
    status: 'Submitted',
  },
  {
    id: 'CMP-002',
    text: 'Street light not working',
    date: '07 Sep 2026',
    status: 'In Progress',
  },
];

export default function ComplaintsScreen() {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] =
    useState<Complaint[]>([]);
  const [role, setRole] = useState<
    'resident' | 'admin'
  >('resident');

  // Load complaints and role whenever screen becomes active
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        // Load role
        const savedRole =
          await getData<string>(ROLE_KEY);

        if (savedRole === 'admin') {
          setRole('admin');
        } else {
          setRole('resident');
        }

        // Load complaints
        const savedComplaints =
          await getData<Complaint[]>(STORAGE_KEY);

        if (savedComplaints) {
          setComplaints(savedComplaints);
        } else {
          setComplaints(initialComplaints);

          await saveData(
            STORAGE_KEY,
            initialComplaints,
          );
        }
      };

      loadData();
    }, [])
  );

  // --------------------------------
  // RESIDENT - SUBMIT COMPLAINT
  // --------------------------------

  const submitComplaint = async () => {
    if (!complaint.trim()) {
      Alert.alert(
        'Required',
        'Please describe your complaint.',
      );
      return;
    }

    // Find highest complaint number
    const highestNumber = complaints.reduce(
      (max, item) => {
        const number = parseInt(
          item.id.replace('CMP-', ''),
          10,
        );

        return number > max ? number : max;
      },
      0,
    );

    const newComplaint: Complaint = {
      id: `CMP-${String(
        highestNumber + 1,
      ).padStart(3, '0')}`,

      text: complaint.trim(),

      date: new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      ),

      status: 'Submitted',
    };

    const updatedComplaints = [
      newComplaint,
      ...complaints,
    ];

    setComplaints(updatedComplaints);

    await saveData(
      STORAGE_KEY,
      updatedComplaints,
    );

    setComplaint('');

    Alert.alert(
      'Complaint Submitted',
      `Your complaint has been submitted successfully.\n\nComplaint ID: ${newComplaint.id}`,
    );
  };

  // --------------------------------
  // ADMIN - UPDATE STATUS
  // --------------------------------

  const updateComplaintStatus = async (
    id: string,
    newStatus: Complaint['status'],
  ) => {
    const updatedComplaints =
      complaints.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      );

    setComplaints(updatedComplaints);

    await saveData(
      STORAGE_KEY,
      updatedComplaints,
    );

    Alert.alert(
      'Status Updated',
      `${id} is now marked as "${newStatus}".`,
    );
  };

  // --------------------------------
  // STATUS STYLES
  // --------------------------------

  const getStatusStyle = (
    status: Complaint['status'],
  ) => {
    if (status === 'Resolved') {
      return styles.resolvedBadge;
    }

    if (status === 'In Progress') {
      return styles.progressBadge;
    }

    return styles.submittedBadge;
  };

  const getStatusTextStyle = (
    status: Complaint['status'],
  ) => {
    if (status === 'Resolved') {
      return styles.resolvedText;
    }

    if (status === 'In Progress') {
      return styles.progressText;
    }

    return styles.submittedText;
  };

  // --------------------------------
  // ADMIN STATUS BUTTONS
  // --------------------------------

  const renderAdminControls = (
    item: Complaint,
  ) => {
    if (role !== 'admin') {
      return null;
    }

    return (
      <View style={styles.adminControls}>
        <Text style={styles.adminControlTitle}>
          Update Status
        </Text>

        <View style={styles.statusButtonsRow}>

          <Pressable
            style={[
              styles.statusButton,
              styles.submittedButton,
              item.status === 'Submitted' &&
                styles.activeStatusButton,
            ]}
            onPress={() =>
              updateComplaintStatus(
                item.id,
                'Submitted',
              )
            }
          >
            <Text
              style={[
                styles.statusButtonText,
                styles.submittedButtonText,
              ]}
            >
              Submitted
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusButton,
              styles.progressButton,
              item.status === 'In Progress' &&
                styles.activeStatusButton,
            ]}
            onPress={() =>
              updateComplaintStatus(
                item.id,
                'In Progress',
              )
            }
          >
            <Text
              style={[
                styles.statusButtonText,
                styles.progressButtonText,
              ]}
            >
              In Progress
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusButton,
              styles.resolvedButton,
              item.status === 'Resolved' &&
                styles.activeStatusButton,
            ]}
            onPress={() =>
              updateComplaintStatus(
                item.id,
                'Resolved',
              )
            }
          >
            <Text
              style={[
                styles.statusButtonText,
                styles.resolvedButtonText,
              ]}
            >
              Resolved
            </Text>
          </Pressable>

        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            Complaints
          </Text>

          <Text style={styles.subtitle}>
            {role === 'admin'
              ? 'Review and manage resident complaints'
              : 'Report an issue in your society'}
          </Text>
        </View>

        {role === 'admin' && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>
              ADMIN
            </Text>
          </View>
        )}
      </View>

      {/* Resident Submit Form */}

      {role === 'resident' && (
        <View style={styles.formCard}>
          <Text style={styles.label}>
            Complaint
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Describe your complaint"
            placeholderTextColor="#94A3B8"
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />

          <Pressable
            style={styles.button}
            onPress={submitComplaint}
          >
            <Text style={styles.buttonText}>
              Submit Complaint
            </Text>
          </Pressable>
        </View>
      )}

      {/* Section Title */}

      <Text style={styles.sectionTitle}>
        {role === 'admin'
          ? 'All Complaints'
          : 'My Complaints'}
      </Text>

      {/* Complaint List */}

      {complaints.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📝
          </Text>

          <Text style={styles.emptyTitle}>
            No Complaints
          </Text>

          <Text style={styles.emptyText}>
            {role === 'admin'
              ? 'There are no complaints to manage.'
              : 'You have not submitted any complaints yet.'}
          </Text>
        </View>
      ) : (
        complaints.map((item) => (
          <View
            style={styles.complaintCard}
            key={item.id}
          >

            {/* Complaint Text */}

            <Text style={styles.complaintText}>
              {item.text}
            </Text>

            <View style={styles.divider} />

            {/* Details */}

            <View style={styles.detailsRow}>

              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>
                  Complaint ID
                </Text>

                <Text style={styles.detailValue}>
                  {item.id}
                </Text>
              </View>

              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>
                  Date
                </Text>

                <Text style={styles.detailValue}>
                  {item.date}
                </Text>
              </View>

            </View>

            {/* Status */}

            <Text style={styles.statusLabel}>
              Status
            </Text>

            <View
              style={[
                styles.statusBadge,
                getStatusStyle(item.status),
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  getStatusTextStyle(
                    item.status,
                  ),
                ]}
              >
                {item.status}
              </Text>
            </View>

            {/* Admin Controls */}

            {renderAdminControls(item)}

          </View>
        ))
      )}

      <View style={styles.bottomSpace} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    lineHeight: 25,
    maxWidth: 300,
  },

  adminBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  adminBadgeText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '800',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 24,
    marginBottom: 35,
  },

  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },

  input: {
    height: 150,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#0F172A',
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 24,
    marginBottom: 18,
  },

  complaintText: {
    fontSize: 20,
    color: '#334155',
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  detailColumn: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 5,
  },

  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  submittedBadge: {
    backgroundColor: '#DBEAFE',
  },

  progressBadge: {
    backgroundColor: '#FEF3C7',
  },

  resolvedBadge: {
    backgroundColor: '#DCFCE7',
  },

  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },

  submittedText: {
    color: '#2563EB',
  },

  progressText: {
    color: '#D97706',
  },

  resolvedText: {
    color: '#16A34A',
  },

  // Admin controls

  adminControls: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  adminControlTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },

  statusButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  statusButton: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeStatusButton: {
    borderWidth: 2,
  },

  submittedButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },

  progressButton: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },

  resolvedButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },

  statusButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  submittedButtonText: {
    color: '#2563EB',
  },

  progressButtonText: {
    color: '#D97706',
  },

  resolvedButtonText: {
    color: '#16A34A',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});