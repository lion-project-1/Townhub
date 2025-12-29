package com.example.backend.mapper;

import com.example.backend.domain.Location;
import com.example.backend.domain.Meeting;
import com.example.backend.domain.MeetingMember;
import com.example.backend.domain.User;
import com.example.backend.dto.MeetingCreateRequest;
import com.example.backend.dto.MeetingDetailResponse;
import com.example.backend.dto.MeetingMemberResponse;
import com.example.backend.enums.MeetingStatus;
import java.util.List;

public class MeetingMapper {


    public static MeetingDetailResponse toMeetingDetailResponse(Meeting meeting,
                                                                List<MeetingMemberResponse> members) {
        return MeetingDetailResponse.builder()
                .meetingId(meeting.getId())
                .title(meeting.getTitle())
                .description(meeting.getDescription())
                .category(meeting.getCategory())
                .province(meeting.getLocation().getProvince())
                .city(meeting.getLocation().getCity())
                .town(meeting.getLocation().getTown())
                .meetingPlace(meeting.getMeetingPlace())
                .schedule(meeting.getSchedule())
                .capacity(meeting.getCapacity())
                .status(meeting.getStatus())
                .members(members)
                .build();
    }

    public static MeetingMemberResponse toMeetingMemberResponse(MeetingMember member) {
        return MeetingMemberResponse.builder()
                .userId(member.getUser().getId())
                .nickname(member.getUser().getNickname())
                .role(member.getRole())
                .build();
    }


    public static Meeting toMeeting(MeetingCreateRequest request, Location location, User host) {
        return Meeting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .meetingPlace(request.getMeetingPlace())
                .schedule(request.getSchedule())
                .capacity(request.getCapacity())
                .status(MeetingStatus.RECRUITING)
                .host(host)
                .location(location)
                .build();
    }

}
