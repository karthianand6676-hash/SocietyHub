import { StyleSheet, Text, TextInput, View, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

type Complaint = {
  id: string;
  text: string;
  date: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
};

export default function ComplaintsScreen() {
  const [complaint, setComplaint] = useState('');

  const [complaints, setComplaints] = useState<Complaint[]>([
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
  ]);

  const submitComplaint = () => {
    if (!complaint.trim()) {
      Alert.alert('Required', 'Please describe your complaint.');
      return;
    }

    const newComplaint: Complaint = {
      id: `CMP-${String(complaints.length + 1).padStart(3, '0')}`,
      text: complaint.trim(),
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Submitted',
    };

    setComplaints([newComplaint, ...complaints]);
    setComplaint('');

    Alert.alert(
      'Complaint Submitted',
      `Your complaint has been submitted successfully.\n\nComplaint ID: ${newComplaint.id}`,
    );
  };

  const getStatusStyle = (status: Complaint['status']) => {
    if (status === 'Resolved') {
      return styles.resolvedBadge;
    }

    if (status === 'In Progress') {
      return styles.progressBadge;
    }

    return styles.submittedBadge;
  };

  const getStatusTextStyle = (status: Complaint['status']) => {
    if (status === 'Resolved') {
      return styles.resolvedText;
    }

    if (status === 'In Progress') {
      return styles.progressText;
    }

    return styles.submittedText;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Complaints</Text>

      <Text style={styles.subtitle}>
        Report an issue in your society
      </Text>

      {/* Submit Complaint */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Complaint</Text>

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

      {/* My Complaints */}
      <Text style={styles.sectionTitle}>
        My Complaints
      </Text>

      {complaints.map((item) => (
        <View style={styles.complaintCard} key={item.id}>

          <Text style={styles.complaintText}>
            {item.text}
          </Text>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>
                Complaint ID
              </Text>

              <Text style={styles.detailValue}>
                {item.id}
              </Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>
                Date
              </Text>

              <Text style={styles.detailValue}>
                {item.date}
              </Text>
            </View>
          </View>

          <Text style={styles.statusLabel}>
            Status
          </Text>

          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
              {item.status}
            </Text>
          </View>

        </View>
      ))}

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

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 30,
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

  bottomSpace: {
    height: 40,
  },
});